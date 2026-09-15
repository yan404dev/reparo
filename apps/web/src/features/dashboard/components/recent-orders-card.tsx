"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/features/orders/components/order-status-badge";
import { ServiceOrderDTO } from "@fluxos/contracts";
import {
  Card,
  CardContent,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";

interface RecentOrdersCardProps {
  orders: ServiceOrderDTO[];
  isLoading: boolean;
}

export function RecentOrdersCard({ orders, isLoading }: RecentOrdersCardProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold tracking-tight">Ordens de Serviço Recentes</h2>
            <Badge>{orders.length}</Badge>
          </div>
          <Link
            href="/orders"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Ver todas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">OS</TableHead>
              <TableHead className="text-sm">Cliente & Aparelho</TableHead>
              <TableHead className="text-sm">Status</TableHead>
              <TableHead className="text-sm text-right">Total Geral</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                  Carregando ordens...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                  Nenhuma ordem cadastrada no momento.
                </TableCell>
              </TableRow>
            ) : (
              orders.slice(0, 5).map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="text-sm py-2.5 font-semibold text-primary">
                    <Link href={`/orders`} className="hover:underline">
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
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-sm py-2.5 text-right font-bold tabular-nums">
                    {formatCurrency(order.grandTotal)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
