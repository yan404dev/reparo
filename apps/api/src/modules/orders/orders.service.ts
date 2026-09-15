import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AddOrderItemInput, CreateServiceOrderInput } from "@fluxos/contracts";
import { OrderStatus, OrderItemType, StockMovementType } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: OrderStatus, search?: string) {
    const orders = await this.prisma.serviceOrder.findMany({
      where: {
        status: status || undefined,
        OR: search
          ? [
              { customer: { name: { contains: search, mode: "insensitive" } } },
              { customer: { phone: { contains: search } } },
              { device: { imei: { contains: search } } },
              { device: { model: { contains: search, mode: "insensitive" } } },
            ]
          : undefined,
      },
      include: {
        customer: true,
        device: true,
        technician: { select: { id: true, name: true, email: true } },
        attendant: { select: { id: true, name: true, email: true } },
        items: { include: { part: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map(this.formatOrder);
  }

  async findById(id: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        device: true,
        technician: { select: { id: true, name: true, email: true } },
        attendant: { select: { id: true, name: true, email: true } },
        items: { include: { part: true } },
        history: {
          include: { changedBy: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      throw new NotFoundException("Ordem de serviço não encontrada");
    }

    return this.formatOrder(order);
  }

  async findByPublicToken(publicToken: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { publicToken },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        device: { select: { id: true, brand: true, model: true, color: true } },
        items: { include: { part: { select: { id: true, name: true, brand: true } } } },
        history: {
          orderBy: { createdAt: "desc" },
          select: { id: true, fromStatus: true, toStatus: true, reason: true, createdAt: true }
        }
      },
    });

    if (!order) {
      throw new NotFoundException("Ordem de serviço não encontrada");
    }

    return this.formatOrder(order);
  }

  async approveByPublicToken(publicToken: string, customerSignature?: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { publicToken },
    });

    if (!order) {
      throw new NotFoundException("Ordem de serviço não encontrada");
    }

    if (order.status !== OrderStatus.CRIADA && order.status !== OrderStatus.AGUARDANDO_APROVACAO) {
      throw new BadRequestException("Esta ordem de serviço não está aguardando aprovação");
    }

    return this.updateStatus(
      order.id,
      OrderStatus.APROVADA,
      order.attendantId,
      `Aprovado pelo cliente via Portal Público${customerSignature ? ` (Assinatura: ${customerSignature})` : ""}`
    );
  }

  async rejectByPublicToken(publicToken: string, rejectionReason?: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { publicToken },
    });

    if (!order) {
      throw new NotFoundException("Ordem de serviço não encontrada");
    }

    if (order.status !== OrderStatus.CRIADA && order.status !== OrderStatus.AGUARDANDO_APROVACAO) {
      throw new BadRequestException("Esta ordem de serviço não pode ser recusada neste estágio");
    }

    return this.updateStatus(
      order.id,
      OrderStatus.CANCELADA,
      order.attendantId,
      `Orçamento recusado pelo cliente via Portal Público${rejectionReason ? `: ${rejectionReason}` : ""}`
    );
  }

  async create(data: CreateServiceOrderInput, attendantId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.create({
        data: {
          customerId: data.customerId,
          deviceId: data.deviceId,
          technicianId: data.technicianId || undefined,
          attendantId,
          reportedDefect: data.reportedDefect,
          entryChecklist: data.entryChecklist,
          status: OrderStatus.CRIADA,
        },
        include: {
          customer: true,
          device: true,
          technician: true,
          attendant: true,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          serviceOrderId: order.id,
          changedById: attendantId,
          fromStatus: OrderStatus.CRIADA,
          toStatus: OrderStatus.CRIADA,
          reason: "Criação da OS e registro de checklist de entrada",
        },
      });

      return this.formatOrder(order);
    });
  }

  async addItem(orderId: string, data: AddOrderItemInput) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new NotFoundException("Ordem de serviço não encontrada");
      }

      if (order.status !== OrderStatus.CRIADA && order.status !== OrderStatus.AGUARDANDO_APROVACAO) {
        throw new BadRequestException("Itens só podem ser adicionados enquanto a OS estiver em criação ou aguardando aprovação");
      }

      let unitCost = data.unitCost;
      let unitPrice = data.unitPrice;

      if (data.type === OrderItemType.PECA && data.partId) {
        const part = await tx.part.findUnique({ where: { id: data.partId } });
        if (!part) {
          throw new NotFoundException("Peça não encontrada");
        }
        unitCost = Number(part.costPrice);
        if (!unitPrice) {
          unitPrice = Number(part.sellingPrice);
        }
      }

      const total = Number(unitPrice) * data.quantity - Number(data.discount);

      await tx.serviceOrderItem.create({
        data: {
          serviceOrderId: orderId,
          type: data.type,
          partId: data.partId || undefined,
          description: data.description,
          quantity: data.quantity,
          unitCost,
          unitPrice,
          discount: data.discount,
          total,
          warrantyDays: data.warrantyDays,
        },
      });

      await this.recalculateTotals(tx, orderId);

      return this.findById(orderId);
    });
  }

  async removeItem(orderId: string, itemId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException("Ordem de serviço não encontrada");
      }

      if (order.status !== OrderStatus.CRIADA && order.status !== OrderStatus.AGUARDANDO_APROVACAO) {
        throw new BadRequestException("Itens não podem ser removidos nesta etapa");
      }

      await tx.serviceOrderItem.delete({
        where: { id: itemId },
      });

      await this.recalculateTotals(tx, orderId);

      return this.findById(orderId);
    });
  }

  async updateStatus(
    orderId: string,
    targetStatus: OrderStatus,
    userId: string,
    reason?: string,
    technicalReport?: string
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.findUnique({
        where: { id: orderId },
        include: { items: { include: { part: true } } },
      });

      if (!order) {
        throw new NotFoundException("Ordem de serviço não encontrada");
      }

      this.validateStatusTransition(order.status, targetStatus);

      if (targetStatus === OrderStatus.APROVADA) {
        for (const item of order.items) {
          if (item.type === OrderItemType.PECA && item.partId) {
            const [part] = await tx.$queryRaw<any[]>`
              SELECT * FROM "parts" WHERE id = ${item.partId} FOR UPDATE
            `;

            if (!part) {
              throw new NotFoundException(`Peça vinculada ao item não foi encontrada`);
            }

            const available = part.stockPhysical - part.stockReserved;
            if (available < item.quantity) {
              throw new ConflictException(
                `Estoque insuficiente para a peça "${part.name}". Disponível: ${available}, Requerido: ${item.quantity}`
              );
            }

            const updatedPart = await tx.part.update({
              where: { id: part.id },
              data: {
                stockReserved: { increment: item.quantity },
              },
            });

            await tx.stockMovement.create({
              data: {
                partId: part.id,
                serviceOrderId: order.id,
                userId,
                type: StockMovementType.RESERVA,
                quantity: item.quantity,
                previousPhysical: part.stockPhysical,
                newPhysical: updatedPart.stockPhysical,
                previousReserved: part.stockReserved,
                newReserved: updatedPart.stockReserved,
                reason: `Reserva automática por aprovação da OS #${order.orderNumber}`,
              },
            });
          }
        }
      }

      if (targetStatus === OrderStatus.EM_REPARO && order.status === OrderStatus.APROVADA) {
        for (const item of order.items) {
          if (item.type === OrderItemType.PECA && item.partId) {
            const [part] = await tx.$queryRaw<any[]>`
              SELECT * FROM "parts" WHERE id = ${item.partId} FOR UPDATE
            `;

            const updatedPart = await tx.part.update({
              where: { id: part.id },
              data: {
                stockPhysical: { decrement: item.quantity },
                stockReserved: { decrement: item.quantity },
              },
            });

            await tx.stockMovement.create({
              data: {
                partId: part.id,
                serviceOrderId: order.id,
                userId,
                type: StockMovementType.BAIXA_REPARO,
                quantity: -item.quantity,
                previousPhysical: part.stockPhysical,
                newPhysical: updatedPart.stockPhysical,
                previousReserved: part.stockReserved,
                newReserved: updatedPart.stockReserved,
                reason: `Baixa física para execução de reparo na OS #${order.orderNumber}`,
              },
            });
          }
        }
      }

      if (targetStatus === OrderStatus.CANCELADA && order.status === OrderStatus.APROVADA) {
        for (const item of order.items) {
          if (item.type === OrderItemType.PECA && item.partId) {
            const [part] = await tx.$queryRaw<any[]>`
              SELECT * FROM "parts" WHERE id = ${item.partId} FOR UPDATE
            `;

            const updatedPart = await tx.part.update({
              where: { id: part.id },
              data: {
                stockReserved: { decrement: item.quantity },
              },
            });

            await tx.stockMovement.create({
              data: {
                partId: part.id,
                serviceOrderId: order.id,
                userId,
                type: StockMovementType.CANCELAMENTO_RESERVA,
                quantity: -item.quantity,
                previousPhysical: part.stockPhysical,
                newPhysical: updatedPart.stockPhysical,
                previousReserved: part.stockReserved,
                newReserved: updatedPart.stockReserved,
                reason: `Estorno de reserva por cancelamento da OS #${order.orderNumber}`,
              },
            });
          }
        }
      }

      if (targetStatus === OrderStatus.FINALIZADA) {
        const now = new Date();
        for (const item of order.items) {
          const warrantyExpires = new Date(now.getTime() + item.warrantyDays * 24 * 60 * 60 * 1000);
          await tx.serviceOrderItem.update({
            where: { id: item.id },
            data: { warrantyEndsAt: warrantyExpires },
          });
        }
      }

      const updatePayload: any = {
        status: targetStatus,
        technicalReport: technicalReport || order.technicalReport,
      };

      if (targetStatus === OrderStatus.APROVADA) updatePayload.approvedAt = new Date();
      if (targetStatus === OrderStatus.EM_REPARO) updatePayload.startedAt = new Date();
      if (targetStatus === OrderStatus.PRONTO_RETIRADA) {
        updatePayload.finishedAt = new Date();
        updatePayload.readyAt = new Date();
      }
      if (targetStatus === OrderStatus.FINALIZADA) updatePayload.deliveredAt = new Date();

      await tx.serviceOrder.update({
        where: { id: orderId },
        data: updatePayload,
      });

      await tx.orderStatusHistory.create({
        data: {
          serviceOrderId: orderId,
          changedById: userId,
          fromStatus: order.status,
          toStatus: targetStatus,
          reason: reason || undefined,
        },
      });

      return this.findById(orderId);
    });
  }

  private validateStatusTransition(current: OrderStatus, target: OrderStatus) {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.CRIADA]: [OrderStatus.AGUARDANDO_APROVACAO, OrderStatus.APROVADA, OrderStatus.CANCELADA],
      [OrderStatus.AGUARDANDO_APROVACAO]: [OrderStatus.APROVADA, OrderStatus.CANCELADA],
      [OrderStatus.APROVADA]: [OrderStatus.EM_REPARO, OrderStatus.CANCELADA],
      [OrderStatus.EM_REPARO]: [OrderStatus.TESTES_FINAIS],
      [OrderStatus.TESTES_FINAIS]: [OrderStatus.PRONTO_RETIRADA, OrderStatus.EM_REPARO],
      [OrderStatus.PRONTO_RETIRADA]: [OrderStatus.FINALIZADA],
      [OrderStatus.FINALIZADA]: [],
      [OrderStatus.CANCELADA]: [],
    };

    const allowed = validTransitions[current];
    if (!allowed || !allowed.includes(target)) {
      throw new BadRequestException(
        `Transição de status inválida de "${current}" para "${target}"`
      );
    }
  }

  private async recalculateTotals(tx: any, orderId: string) {
    const items = await tx.serviceOrderItem.findMany({
      where: { serviceOrderId: orderId },
    });

    let totalPartsPrice = 0;
    let totalLaborPrice = 0;
    let totalDiscount = 0;

    for (const item of items) {
      if (item.type === OrderItemType.PECA) {
        totalPartsPrice += Number(item.unitPrice) * item.quantity;
      } else {
        totalLaborPrice += Number(item.unitPrice) * item.quantity;
      }
      totalDiscount += Number(item.discount);
    }

    const grandTotal = totalPartsPrice + totalLaborPrice - totalDiscount;

    await tx.serviceOrder.update({
      where: { id: orderId },
      data: {
        totalPartsPrice,
        totalLaborPrice,
        totalDiscount,
        grandTotal,
      },
    });
  }

  private formatOrder(order: any) {
    return {
      ...order,
      totalPartsPrice: Number(order.totalPartsPrice),
      totalLaborPrice: Number(order.totalLaborPrice),
      totalDiscount: Number(order.totalDiscount),
      grandTotal: Number(order.grandTotal),
      items: order.items?.map((item: any) => ({
        ...item,
        unitCost: Number(item.unitCost),
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        total: Number(item.total),
      })),
    };
  }
}
