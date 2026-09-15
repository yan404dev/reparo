import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";
import { DashboardMetricsDTO } from "@fluxos/contracts";
import { PricingCalculatorService } from "../orders/services/pricing-calculator.service";
import { WhatsAppBuilderService } from "../orders/services/whatsapp-builder.service";

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingCalculatorService,
    private whatsappService: WhatsAppBuilderService
  ) {}

  async getMetrics(): Promise<DashboardMetricsDTO> {
    const [
      activeOrdersCount,
      readyOrdersCount,
      revenueResult,
      recentOrdersRaw,
      allPartsRaw,
    ] = await Promise.all([
      // 1. Ordens ativas
      this.prisma.serviceOrder.count({
        where: {
          status: {
            notIn: [OrderStatus.FINALIZADA, OrderStatus.CANCELADA],
          },
        },
      }),

      // 2. Ordens prontas para retirada
      this.prisma.serviceOrder.count({
        where: {
          status: OrderStatus.PRONTO_RETIRADA,
        },
      }),

      // 3. Faturamento total de ordens finalizadas e prontas
      this.prisma.serviceOrder.aggregate({
        where: {
          status: {
            in: [OrderStatus.FINALIZADA, OrderStatus.PRONTO_RETIRADA],
          },
        },
        _sum: {
          grandTotal: true,
        },
      }),

      // 4. Últimas 5 ordens
      this.prisma.serviceOrder.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          device: true,
          technician: { select: { id: true, name: true, email: true } },
          attendant: { select: { id: true, name: true, email: true } },
          items: { include: { part: true } },
        },
      }),

      // 5. Peças para identificar estoque crítico
      this.prisma.part.findMany({
        include: {
          category: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const totalRevenue = Number(revenueResult._sum.grandTotal || 0);

    // Formata as ordens recentes incluindo os novos campos calculados
    const recentOrders = recentOrdersRaw.map((order) => {
      const overdue = order.status === OrderStatus.PRONTO_RETIRADA
        ? this.pricingService.checkDelayedPickup(order.readyAt, order.updatedAt)
        : { isLateDelivery: false, hoursLate: 0, daysLate: 0 };

      const grandTotalNum = Number(order.grandTotal);
      const displayTotalPrice = this.pricingService.formatCurrency(grandTotalNum);

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
        statusGroup: (order.status === OrderStatus.CRIADA || order.status === OrderStatus.AGUARDANDO_APROVACAO)
          ? "pending"
          : (order.status === OrderStatus.CANCELADA ? "cancelled" : "approved") as any,
        checklistDisplay: [],
        totalPartsPrice: Number(order.totalPartsPrice),
        totalLaborPrice: Number(order.totalLaborPrice),
        totalDiscount: Number(order.totalDiscount),
        grandTotal: grandTotalNum,
        displayTotalPrice,
        isLateDelivery: overdue.isLateDelivery,
        hoursLate: overdue.hoursLate,
        daysLate: overdue.daysLate,
        whatsappUrl,
        items: order.items?.map((item) => ({
          ...item,
          unitCost: Number(item.unitCost),
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount),
          total: Number(item.total),
        })),
      };
    });

    // Filtra e formata peças com estoque baixo
    const lowStockPartsRaw = allPartsRaw.filter(
      (part) => part.stockPhysical - part.stockReserved <= part.minStockThreshold
    );

    const lowStockParts = lowStockPartsRaw.slice(0, 10).map((part) => {
      const costPriceNum = Number(part.costPrice);
      const sellingPriceNum = Number(part.sellingPrice);
      const stockAvailable = part.stockPhysical - part.stockReserved;
      return {
        ...part,
        costPrice: costPriceNum,
        suggestedMarkupPercent: Number(part.suggestedMarkupPercent),
        sellingPrice: sellingPriceNum,
        displayCostPrice: this.pricingService.formatCurrency(costPriceNum),
        displaySellingPrice: this.pricingService.formatCurrency(sellingPriceNum),
        stockAvailable,
        isLowStock: stockAvailable <= part.minStockThreshold,
      };
    });

    return {
      activeOrdersCount,
      readyOrdersCount,
      lowStockPartsCount: lowStockPartsRaw.length,
      totalRevenue,
      displayTotalRevenue: this.pricingService.formatCurrency(totalRevenue),
      recentOrders: recentOrders as any,
      lowStockParts: lowStockParts as any,
    };
  }
}
