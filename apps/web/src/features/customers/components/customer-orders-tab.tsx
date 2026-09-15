import React from "react";
import Link from "next/link";
import { ServiceOrderDTO } from "@fluxos/contracts";
import { formatDate, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/features/orders/components/order-status-badge";
import { Card, CardContent, Button } from "@/components/ui";

interface CustomerOrdersTabProps {
  orders?: ServiceOrderDTO[];
}

export function CustomerOrdersTab({ orders }: CustomerOrdersTabProps) {
  if (!orders || orders.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-12 text-center text-muted-foreground text-sm">
          Nenhuma ordem de serviço cadastrada.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">
                    OS #{order.orderNumber}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-foreground font-medium">
                  {order.device?.brand} {order.device?.model} • Defeito: {order.reportedDefect}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Aberta em {formatDate(order.createdAt)} • Atendente: {order.attendant?.name || "Recepção"}
                </p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Total</span>
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {order.displayTotalPrice || formatCurrency(Number(order.grandTotal || 0))}
                  </span>
                </div>

                <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
                  <Link href={`/orders/${order.id}`}>Ver Detalhes</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
