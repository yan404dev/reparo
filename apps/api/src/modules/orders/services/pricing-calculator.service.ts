import { Injectable } from "@nestjs/common";
import { OrderItemType } from "@prisma/client";

export interface CalculatedOrderTotals {
  totalPartsPrice: number;
  totalLaborPrice: number;
  totalDiscount: number;
  grandTotal: number;
  totalCost: number;
  profitMarginPercentage: number;
  displayTotalPrice: string;
}

export interface OverdueCalculation {
  isLateDelivery: boolean;
  hoursLate: number;
  daysLate: number;
}

@Injectable()
export class PricingCalculatorService {
  formatCurrency(val: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);
  }

  calculateMarkupPrice(costPrice: number, markupPercent: number): number {
    const markup = markupPercent ?? 50;
    return Number((Number(costPrice) * (1 + markup / 100)).toFixed(2));
  }

  calculateItemTotal(unitPrice: number, quantity: number, discount = 0): number {
    return Number((Number(unitPrice) * Number(quantity) - Number(discount)).toFixed(2));
  }

  calculateOrderTotals(
    items: Array<{
      type: OrderItemType | string;
      unitPrice: number | string;
      unitCost?: number | string;
      quantity: number;
      discount?: number | string;
    }>
  ): CalculatedOrderTotals {
    let totalPartsPrice = 0;
    let totalLaborPrice = 0;
    let totalDiscount = 0;
    let totalCost = 0;

    for (const item of items) {
      const uPrice = Number(item.unitPrice || 0);
      const uCost = Number(item.unitCost || 0);
      const qty = Number(item.quantity || 1);
      const disc = Number(item.discount || 0);

      if (item.type === OrderItemType.PECA || item.type === "PECA") {
        totalPartsPrice += uPrice * qty;
      } else {
        totalLaborPrice += uPrice * qty;
      }

      totalDiscount += disc;
      totalCost += uCost * qty;
    }

    const grandTotal = Math.max(0, Number((totalPartsPrice + totalLaborPrice - totalDiscount).toFixed(2)));
    totalPartsPrice = Number(totalPartsPrice.toFixed(2));
    totalLaborPrice = Number(totalLaborPrice.toFixed(2));
    totalDiscount = Number(totalDiscount.toFixed(2));
    totalCost = Number(totalCost.toFixed(2));

    let profitMarginPercentage = 0;
    if (grandTotal > 0) {
      const grossProfit = grandTotal - totalCost;
      profitMarginPercentage = Number(((grossProfit / grandTotal) * 100).toFixed(1));
    }

    return {
      totalPartsPrice,
      totalLaborPrice,
      totalDiscount,
      grandTotal,
      totalCost,
      profitMarginPercentage,
      displayTotalPrice: this.formatCurrency(grandTotal),
    };
  }

  checkDelayedPickup(
    readyAt?: Date | string | null,
    updatedAt?: Date | string | null
  ): OverdueCalculation {
    const timestamp = readyAt || updatedAt;
    if (!timestamp) {
      return { isLateDelivery: false, hoursLate: 0, daysLate: 0 };
    }

    const readyTime = new Date(timestamp).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, now - readyTime);
    const hoursElapsed = Math.floor(diffMs / (1000 * 60 * 60));
    const daysElapsed = Math.floor(hoursElapsed / 24);

    return {
      isLateDelivery: hoursElapsed >= 48,
      hoursLate: hoursElapsed,
      daysLate: daysElapsed,
    };
  }
}
