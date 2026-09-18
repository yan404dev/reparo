import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCustomerInput, CustomerTimelineEventDTO, formatDocument } from "@fluxos/contracts";
import { OrderStatus } from "@prisma/client";
import { PricingCalculatorService } from "../orders/services/pricing-calculator.service";
import { WhatsAppBuilderService } from "../orders/services/whatsapp-builder.service";
import { buildPaginatedResponse } from "../../common/utils/pagination.util";

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingCalculatorService,
    private whatsappService: WhatsAppBuilderService
  ) {}

  async findAll(search?: string, page?: number, limit?: number) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const skip = (safePage - 1) * safeLimit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
            { document: { contains: search } },
          ],
        }
      : undefined;

    const [total, customers] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        include: {
          devices: true,
          orders: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              grandTotal: true,
              createdAt: true,
            },
          },
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
      }),
    ]);

    const formatted = customers.map((c) => {
      const orderCount = c._count?.orders ?? c.orders.length;
      const totalSpent = c.orders.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);
      const activeOrdersCount = c.orders.filter(
        (o) => o.status !== OrderStatus.FINALIZADA && o.status !== OrderStatus.CANCELADA
      ).length;
      return {
        ...c,
        totalSpent,
        displayTotalSpent: this.pricingService.formatCurrency(totalSpent),
        displayDocument: formatDocument(c.document),
        isRecurrent: orderCount > 1,
        hasActiveOrders: activeOrdersCount > 0,
        activeOrdersCount,
        whatsappUrl: this.whatsappService.buildCustomerContactUrl(c.name, c.phone),
      };
    });

    return buildPaginatedResponse(formatted, total, safePage, safeLimit);
  }


  async findByDocument(document: string) {
    const cleanDoc = document.replace(/\D/g, "");
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { document: cleanDoc },
          { document: document },
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
      include: {
        devices: {
          orderBy: { updatedAt: "desc" },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            device: true,
          },
        },
      },
    });

    return customer;
  }

  async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        devices: {
          orderBy: { createdAt: "desc" },
          include: {
            orders: {
              select: {
                id: true,
                orderNumber: true,
                status: true,
                reportedDefect: true,
                grandTotal: true,
                createdAt: true,
              },
            },
          },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            device: true,
            technician: { select: { id: true, name: true, email: true } },
            attendant: { select: { id: true, name: true, email: true } },
            items: { include: { part: true } },
            history: {
              orderBy: { createdAt: "asc" },
              include: { changedBy: { select: { id: true, name: true } } },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException("Cliente não encontrado");
    }

    const orderCount = customer.orders.length;
    const totalSpent = customer.orders.reduce(
      (acc, o) => acc + Number(o.grandTotal || 0),
      0
    );
    const activeOrdersCount = customer.orders.filter(
      (o) => o.status !== OrderStatus.FINALIZADA && o.status !== OrderStatus.CANCELADA
    ).length;

    const timelineEvents = this.buildTimeline(customer.orders);

    return {
      ...customer,
      totalSpent,
      displayTotalSpent: this.pricingService.formatCurrency(totalSpent),
      displayDocument: formatDocument(customer.document),
      isRecurrent: orderCount > 1,
      hasActiveOrders: activeOrdersCount > 0,
      activeOrdersCount,
      whatsappUrl: this.whatsappService.buildCustomerContactUrl(customer.name, customer.phone),
      timelineEvents,
    };
  }

  private buildTimeline(orders: any[]): CustomerTimelineEventDTO[] {
    if (!orders || orders.length === 0) return [];
    const events: CustomerTimelineEventDTO[] = [];

    for (const order of orders) {
      // 1. Abertura da Ordem
      events.push({
        id: `order-created-${order.id}`,
        type: "ORDER_CREATED",
        timestamp: new Date(order.createdAt).getTime(),
        date: order.createdAt,
        orderId: order.id,
        orderNumber: order.orderNumber,
        title: `Entrada da OS #${order.orderNumber}`,
        subtitle: `${order.device?.brand || ""} ${order.device?.model || "Aparelho"} • ${order.device?.color || ""}`,
        description: `Defeito relatado: "${order.reportedDefect}"`,
        status: order.status,
        total: Number(order.grandTotal || 0),
        author: order.attendant?.name || "Recepção",
        iconType: "smartphone",
        badgeColor: "blue",
      });

      // 2. Histórico de status
      if (order.history && order.history.length > 0) {
        order.history.forEach((h: any, idx: number) => {
          if (idx === 0 && h.fromStatus === "CRIADA" && h.toStatus === "CRIADA") {
            return;
          }

          let title = `Status atualizado: ${h.toStatus}`;
          let color = "indigo";
          let iconType: CustomerTimelineEventDTO["iconType"] = "clock";

          if (h.toStatus === "AGUARDANDO_APROVACAO") {
            title = "Orçamento gerado e aguardando aprovação";
            color = "amber";
            iconType = "clock";
          } else if (h.toStatus === "APROVADA") {
            title = "Orçamento Aprovado pelo Cliente";
            color = "blue";
            iconType = "check";
          } else if (h.toStatus === "EM_REPARO") {
            title = "Aparelho em bancada para reparo";
            color = "purple";
            iconType = "wrench";
          } else if (h.toStatus === "TESTES_FINAIS") {
            title = "Reparo concluído, em testes de qualidade";
            color = "indigo";
            iconType = "check";
          } else if (h.toStatus === "PRONTO_RETIRADA") {
            title = "Pronto para Retirada pelo Cliente";
            color = "emerald";
            iconType = "check";
          } else if (h.toStatus === "FINALIZADA") {
            title = "Aparelho entregue e OS Concluída";
            color = "emerald";
            iconType = "check";
          } else if (h.toStatus === "CANCELADA") {
            title = "Ordem de Serviço Cancelada";
            color = "red";
            iconType = "alert";
          }

          events.push({
            id: `history-${h.id}`,
            type: "STATUS_CHANGE",
            timestamp: new Date(h.createdAt).getTime(),
            date: h.createdAt,
            orderId: order.id,
            orderNumber: order.orderNumber,
            title,
            subtitle: `OS #${order.orderNumber} • ${order.device?.model || ""}`,
            description: h.reason || undefined,
            status: h.toStatus,
            total: Number(order.grandTotal || 0),
            author: h.changedBy?.name || "Equipe Técnica",
            iconType,
            badgeColor: color,
          });
        });
      }

      // 3. Peças e serviços
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          events.push({
            id: `item-${item.id}`,
            type: "ITEM_APPLIED",
            timestamp: new Date(order.createdAt).getTime() + 1000 * 60 * 15,
            date: order.createdAt,
            orderId: order.id,
            orderNumber: order.orderNumber,
            title: item.type === "PECA" ? `Peça Instalada: ${item.description}` : `Serviço Realizado: ${item.description}`,
            subtitle: `OS #${order.orderNumber} • Qtd: ${item.quantity}x`,
            description: `Valor: ${this.pricingService.formatCurrency(Number(item.unitPrice || 0))} • Garantia: ${item.warrantyDays} dias`,
            total: Number(item.total || 0),
            author: order.technician?.name || "Técnico",
            iconType: "wrench",
            badgeColor: "slate",
          });
        });
      }
    }

    return events.sort((a, b) => a.timestamp - b.timestamp);
  }

  async create(data: CreateCustomerInput) {
    if (data.document) {
      const cleanDoc = data.document.replace(/\D/g, "");
      const existing = await this.prisma.customer.findFirst({
        where: {
          OR: [{ document: cleanDoc }, { document: data.document }],
        },
      });
      if (existing) {
        throw new ConflictException("CPF/CNPJ já cadastrado");
      }
    }

    return this.prisma.customer.create({
      data: {
        ...data,
        document: data.document ? data.document.replace(/\D/g, "") : null,
      },
      include: { devices: true },
    });
  }
}
