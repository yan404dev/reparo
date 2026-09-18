import React from "react";
import Link from "next/link";
import { ServiceOrderDTO } from "@fluxos/contracts";
import { TableRow, TableCell } from "@/components/ui";
import { OrderStatusText } from "@/features/orders/components/order-status-text";
import { OrdersTableActions } from "@/features/orders/components/orders-table-actions";
import { CopyQuoteLinkButton } from "./copy-quote-link-button";

interface RecentOrdersTableRowProps {
  order: ServiceOrderDTO;
}

export function RecentOrdersTableRow({ order }: RecentOrdersTableRowProps) {
  return (
    <TableRow>
      <TableCell className="text-sm py-2.5 font-semibold text-primary">
        <Link href={`/orders/${order.id}`} className="hover:underline">
          #{order.orderNumber}
        </Link>
      </TableCell>
      <TableCell className="text-sm py-2.5">
        <div>
          <p className="font-semibold text-foreground">{order.customer?.name}</p>
          <p className="text-xs text-muted-foreground">
            {order.device?.model} • IMEI: {order.device?.imei}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-sm py-2.5">
        <OrderStatusText status={order.status} />
      </TableCell>
      <TableCell className="text-sm py-2.5 text-right font-bold tabular-nums">
        {order.displayTotalPrice}
      </TableCell>
      <TableCell className="text-sm py-2.5 pr-3 text-right">
        <div className="inline-flex items-center justify-end gap-2">
          {order.publicToken && (
            <CopyQuoteLinkButton
              publicToken={order.publicToken}
              orderNumber={order.orderNumber}
            />
          )}
          <OrdersTableActions order={order} />
        </div>
      </TableCell>
    </TableRow>
  );
}
