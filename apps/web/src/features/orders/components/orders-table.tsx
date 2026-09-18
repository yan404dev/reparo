import React from "react";
import { ServiceOrderDTO } from "@fluxos/contracts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import { OrdersTableRow } from "./orders-table-row";

interface OrdersTableProps {
  orders: ServiceOrderDTO[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-sm">OS</TableHead>
          <TableHead className="text-sm">Cliente</TableHead>
          <TableHead className="text-sm">Smartphone & IMEI</TableHead>
          <TableHead className="text-sm">Defeito Relatado</TableHead>
          <TableHead className="text-sm">Status</TableHead>
          <TableHead className="text-sm text-right">Total</TableHead>
          <TableHead className="text-sm text-right pr-3">Ações Rápidas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-sm text-muted-foreground py-12"
            >
              Nenhuma ordem de serviço encontrada.
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <OrdersTableRow key={order.id} order={order} />
          ))
        )}
      </TableBody>
    </Table>
  );
}
