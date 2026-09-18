import React from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { CustomerDTO } from "@fluxos/contracts";
import { TableRow, TableCell } from "@/components/ui";
import { CustomersTableActions } from "./customers-table-actions";
import { CustomerStatusText } from "./customer-status-text";

interface CustomersTableRowProps {
  customer: CustomerDTO;
}

export function CustomersTableRow({ customer }: CustomersTableRowProps) {
  const orderCount = customer._count?.orders ?? customer.orders?.length ?? 0;

  return (
    <TableRow>
      <TableCell className="text-sm py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
            {customer.name ? (
              customer.name.charAt(0).toUpperCase()
            ) : (
              <Users className="w-4 h-4" />
            )}
          </div>
          <div>
            <Link
              href={`/customers/${customer.id}`}
              className="font-semibold text-foreground hover:underline"
            >
              {customer.name}
            </Link>
            <p className="text-xs text-muted-foreground">{customer.email || "Sem e-mail"}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm py-3 font-mono text-muted-foreground">
        {customer.document || "Não informado"}
      </TableCell>
      <TableCell className="text-sm py-3 text-muted-foreground">
        {customer.phone || "Não informado"}
      </TableCell>
      <TableCell className="text-sm py-3 text-center">
        {orderCount}
      </TableCell>
      <TableCell className="text-sm py-3">
        <CustomerStatusText
          hasActiveOrders={customer.hasActiveOrders}
          isRecurrent={customer.isRecurrent}
        />
      </TableCell>
      <TableCell className="text-sm py-3 pr-3 text-right">
        <CustomersTableActions customer={customer} />
      </TableCell>
    </TableRow>
  );
}
