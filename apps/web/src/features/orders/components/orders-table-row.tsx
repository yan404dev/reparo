import React from "react";
import Link from "next/link";
import { Smartphone, AlertCircle } from "lucide-react";
import { ServiceOrderDTO } from "@fluxos/contracts";
import { TableRow, TableCell } from "@/components/ui";
import { OrderStatusText } from "./order-status-text";
import { OrdersTableActions } from "./orders-table-actions";

interface OrdersTableRowProps {
  order: ServiceOrderDTO;
}

export function OrdersTableRow({ order }: OrdersTableRowProps) {
  return (
    <TableRow>
      <TableCell className="text-sm py-2.5 font-semibold text-primary">
        <Link href={`/orders/${order.id}`} className="hover:underline">
          #{order.orderNumber}
        </Link>
      </TableCell>
      <TableCell className="text-sm py-2.5">
        <p className="font-semibold text-foreground">{order.customer?.name}</p>
        <p className="text-xs text-muted-foreground">{order.customer?.phone}</p>
      </TableCell>
      <TableCell className="text-sm py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{order.device?.model}</p>
            <p className="text-xs font-mono text-muted-foreground">
              IMEI: {order.device?.imei}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm py-2.5 max-w-xs truncate text-muted-foreground">
        {order.reportedDefect}
      </TableCell>
      <TableCell className="text-sm py-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <OrderStatusText status={order.status} />
          {order.isLateDelivery && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
              <AlertCircle className="w-3 h-3" />
              Atrasado (+{order.daysLate > 0 ? `${order.daysLate}d` : `${order.hoursLate}h`})
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm py-2.5 text-right font-bold tabular-nums">
        {order.displayTotalPrice}
      </TableCell>
      <TableCell className="text-sm py-2.5 pr-3 text-right">
        <OrdersTableActions order={order} />
      </TableCell>
    </TableRow>
  );
}
