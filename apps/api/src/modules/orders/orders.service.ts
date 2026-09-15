import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AddOrderItemInput, CreateServiceOrderInput } from "@fluxos/contracts";
import { OrderStatus, OrderItemType, StockMovementType } from "@prisma/client";
import { PricingCalculatorService } from "./services/pricing-calculator.service";
import { WhatsAppBuilderService } from "./services/whatsapp-builder.service";

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingCalculatorService,
    private whatsappService: WhatsAppBuilderService
  ) {}

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
      let resolvedCustomerId = data.customerId;

      // Se informou CPF / documento, busca cliente existente para unificar ("quando tiver o mesmo cpf, junta")
      if (data.customerDocument) {
        const cleanDoc = data.customerDocument.replace(/\D/g, "");
        let existingCustomer = await tx.customer.findFirst({
          where: {
            OR: [
              { document: cleanDoc },
              { document: data.customerDocument },
              ...(cleanDoc.length === 11
                ? [
                    {
                      document: cleanDoc.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4"
                      ),
                    },
                  ]
                : []),
            ],
          },
        });

        if (existingCustomer) {
          // Cliente já existente com esse CPF: junta e atualiza telefone/nome se passados
          existingCustomer = await tx.customer.update({
            where: { id: existingCustomer.id },
            data: {
              name: data.customerName || existingCustomer.name,
              phone: data.customerPhone || existingCustomer.phone,
              email: data.customerEmail !== undefined ? data.customerEmail : existingCustomer.email,
            },
          });
          resolvedCustomerId = existingCustomer.id;
        } else {
          // Novo cliente: cadastra automaticamente
          const newCustomer = await tx.customer.create({
            data: {
              name: data.customerName || "Cliente",
              document: cleanDoc,
              phone: data.customerPhone || "(00) 00000-0000",
              email: data.customerEmail || null,
            },
          });
          resolvedCustomerId = newCustomer.id;
        }
      } else if (!resolvedCustomerId && data.customerName) {
        const newCustomer = await tx.customer.create({
          data: {
            name: data.customerName,
            phone: data.customerPhone || "(00) 00000-0000",
            email: data.customerEmail || null,
          },
        });
        resolvedCustomerId = newCustomer.id;
      }

      if (!resolvedCustomerId) {
        throw new BadRequestException("Cliente não informado ou inválido");
      }

      // Resolução do Aparelho (existente ou novo cadastrado na OS)
      let resolvedDeviceId = data.deviceId;
      if (!resolvedDeviceId && (data.deviceBrand || data.deviceModel)) {
        const cleanImei = data.deviceImei?.trim() || "";
        let existingDevice = null;
        if (cleanImei) {
          existingDevice = await tx.device.findFirst({
            where: { imei: cleanImei },
          });
        }

        if (existingDevice) {
          resolvedDeviceId = existingDevice.id;
        } else {
          const generatedImei =
            cleanImei ||
            `SN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
          const newDevice = await tx.device.create({
            data: {
              customerId: resolvedCustomerId,
              brand: data.deviceBrand || "Genérico",
              model: data.deviceModel || "Smartphone",
              imei: generatedImei,
              color: data.deviceColor || null,
              passcode: data.devicePasscode || null,
            },
          });
          resolvedDeviceId = newDevice.id;
        }
      }

      if (!resolvedDeviceId) {
        throw new BadRequestException("Aparelho não informado ou inválido");
      }

      const order = await tx.serviceOrder.create({
        data: {
          customerId: resolvedCustomerId,
          deviceId: resolvedDeviceId,
          technicianId: data.technicianId || undefined,
          attendantId,
          reportedDefect: data.reportedDefect,
          entryChecklist: data.entryChecklist as any,
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
          reason: "Entrada do aparelho e checklist inicial registrado",
        },
      });

      if (data.initialQuote) {
        const { partId, partDescription, partPrice, laborPrice, discount, warrantyDays } = data.initialQuote;
        let hasItems = false;

        if (partPrice && partPrice > 0) {
          let unitCost = 0;
          let description = partDescription?.trim() || "Peça de reposição";

          if (partId) {
            const part = await tx.part.findUnique({ where: { id: partId } });
            if (part) {
              unitCost = Number(part.costPrice);
              if (!partDescription) description = part.name;
            }
          }

          await tx.serviceOrderItem.create({
            data: {
              serviceOrderId: order.id,
              type: OrderItemType.PECA,
              partId: partId || undefined,
              description,
              quantity: 1,
              unitCost,
              unitPrice: partPrice,
              discount: discount || 0,
              total: partPrice - (discount || 0),
              warrantyDays: warrantyDays ?? 90,
            },
          });
          hasItems = true;
        }

        if (laborPrice && laborPrice > 0) {
          await tx.serviceOrderItem.create({
            data: {
              serviceOrderId: order.id,
              type: OrderItemType.SERVICO_MAO_DE_OBRA,
              description: "Mão de obra técnica especializada",
              quantity: 1,
              unitCost: 0,
              unitPrice: laborPrice,
              discount: 0,
              total: laborPrice,
              warrantyDays: warrantyDays ?? 90,
            },
          });
          hasItems = true;
        }

        if (hasItems) {
          await this.recalculateTotals(tx, order.id);
          await tx.serviceOrder.update({
            where: { id: order.id },
            data: { status: OrderStatus.AGUARDANDO_APROVACAO },
          });
          await tx.orderStatusHistory.create({
            data: {
              serviceOrderId: order.id,
              changedById: attendantId,
              fromStatus: OrderStatus.CRIADA,
              toStatus: OrderStatus.AGUARDANDO_APROVACAO,
              reason: "Orçamento inicial preenchido no balcão e aguardando aprovação do cliente",
            },
          });
        }
      }

      const freshOrder = await tx.serviceOrder.findUnique({
        where: { id: order.id },
        include: {
          customer: true,
          device: true,
          technician: true,
          attendant: true,
          items: { include: { part: true } },
          history: { orderBy: { createdAt: "desc" } },
        },
      });

      return this.formatOrder(freshOrder || order);
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

      const total = this.pricingService.calculateItemTotal(unitPrice, data.quantity, data.discount);

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

    const totals = this.pricingService.calculateOrderTotals(items);

    await tx.serviceOrder.update({
      where: { id: orderId },
      data: {
        totalPartsPrice: totals.totalPartsPrice,
        totalLaborPrice: totals.totalLaborPrice,
        totalDiscount: totals.totalDiscount,
        grandTotal: totals.grandTotal,
      },
    });
  }

  private static readonly APPROVED_STATUSES: Set<OrderStatus> = new Set([
    OrderStatus.APROVADA,
    OrderStatus.EM_REPARO,
    OrderStatus.TESTES_FINAIS,
    OrderStatus.PRONTO_RETIRADA,
    OrderStatus.FINALIZADA,
  ]);

  private static readonly PENDING_STATUSES: Set<OrderStatus> = new Set([
    OrderStatus.CRIADA,
    OrderStatus.AGUARDANDO_APROVACAO,
  ]);

  private deriveStatusGroup(status: OrderStatus): "pending" | "approved" | "cancelled" {
    if (OrdersService.PENDING_STATUSES.has(status)) return "pending";
    if (OrdersService.APPROVED_STATUSES.has(status)) return "approved";
    return "cancelled";
  }

  private buildChecklistDisplay(checklist: any): Array<{ label: string; isOk: boolean; displayValue: string }> {
    if (!checklist) return [];
    return [
      { label: "Tela Trincada", isOk: !checklist.screenBroken, displayValue: checklist.screenBroken ? "Com Trincos" : "Íntegra" },
      { label: "Touch Screen", isOk: !!checklist.touchWorks, displayValue: checklist.touchWorks ? "OK" : "Com Falhas" },
      { label: "Biometria / Face ID", isOk: !!checklist.faceIdWorking, displayValue: checklist.faceIdWorking ? "OK" : "Inoperante" },
      { label: "Câmeras", isOk: !!checklist.camerasOk, displayValue: checklist.camerasOk ? "OK" : "Com Falhas" },
      { label: "Áudio & Microfone", isOk: !!checklist.audioOk, displayValue: checklist.audioOk ? "OK" : "Com Falhas" },
      { label: "Conector de Carga", isOk: !!checklist.chargePortWorking, displayValue: checklist.chargePortWorking ? "Carrega" : "Com Mau Contato" },
    ];
  }

  private formatOrder = (order: any) => {
    const overdue = order.status === OrderStatus.PRONTO_RETIRADA
      ? this.pricingService.checkDelayedPickup(order.readyAt, order.updatedAt)
      : { isLateDelivery: false, hoursLate: 0, daysLate: 0 };

    const grandTotalNum = Number(order.grandTotal || 0);
    const displayTotalPrice = this.pricingService.formatCurrency(grandTotalNum);

    let profitMarginPercentage = 0;
    if (order.items && order.items.length > 0) {
      const calculated = this.pricingService.calculateOrderTotals(order.items);
      profitMarginPercentage = calculated.profitMarginPercentage;
    }

    const whatsappUrl = this.whatsappService.resolveOrderWhatsAppUrl(
      order.status,
      order.customer?.name || "Cliente",
      order.customer?.phone || "",
      order.device?.model || "Aparelho",
      order.publicToken,
      displayTotalPrice,
      overdue.isLateDelivery
    );

    return {
      ...order,
      statusGroup: this.deriveStatusGroup(order.status),
      checklistDisplay: this.buildChecklistDisplay(order.entryChecklist),
      totalPartsPrice: Number(order.totalPartsPrice || 0),
      totalLaborPrice: Number(order.totalLaborPrice || 0),
      totalDiscount: Number(order.totalDiscount || 0),
      grandTotal: grandTotalNum,
      displayTotalPrice,
      profitMarginPercentage,
      isLateDelivery: overdue.isLateDelivery,
      hoursLate: overdue.hoursLate,
      daysLate: overdue.daysLate,
      whatsappUrl,
      items: order.items?.map((item: any) => ({
        ...item,
        unitCost: Number(item.unitCost || 0),
        unitPrice: Number(item.unitPrice || 0),
        discount: Number(item.discount || 0),
        total: Number(item.total || 0),
      })),
    };
  };
}
