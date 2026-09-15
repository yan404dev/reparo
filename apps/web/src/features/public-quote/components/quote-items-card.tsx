import React from "react";
import { Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui";
import { SectionDivider } from "./section-divider";

interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  warrantyDays: number;
}

interface QuoteItemsCardProps {
  items: OrderItem[];
  totalPartsPrice: number;
  totalLaborPrice: number;
  totalDiscount: number;
  grandTotal: number;
}

export function QuoteItemsCard({
  items,
  totalPartsPrice,
  totalLaborPrice,
  totalDiscount,
  grandTotal,
}: QuoteItemsCardProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5 space-y-4">
        <SectionDivider icon={Package} title="Itens & Peças do Orçamento" />

        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <div>
                <p className="font-semibold text-foreground">{item.description}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {item.quantity}x {formatCurrency(item.unitPrice)} • Garantia: {item.warrantyDays} dias
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-foreground text-sm">{formatCurrency(item.total)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-muted/60 rounded-lg space-y-1.5 text-xs border border-border">
          <div className="flex justify-between text-muted-foreground">
            <span>Total em Peças</span>
            <span>{formatCurrency(totalPartsPrice)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Mão de Obra Especializada</span>
            <span>{formatCurrency(totalLaborPrice)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Desconto Aplicado</span>
              <span>- {formatCurrency(totalDiscount)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between items-center text-sm font-bold text-foreground">
            <span>Valor Total Final</span>
            <span className="text-primary text-base">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
