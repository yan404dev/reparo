"use client";

import React from "react";
import Link from "next/link";
import { Smartphone, ChevronRight, MessageCircle, AlertCircle, Share2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { checkDelayedPickup, getWhatsAppDelayedPickupUrl, getWhatsAppReadyPickupUrl, getWhatsAppQuoteUrl } from "@/lib/whatsapp";
import { StatusBadge } from "./order-status-badge";
import { ServiceOrderDTO } from "@fluxos/contracts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
} from "@/components/ui";

interface OrdersTableProps {
  orders: ServiceOrderDTO[];
  isLoading: boolean;
}

export function OrdersTable({ orders, isLoading }: OrdersTableProps) {
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
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
              Carregando ordens de serviço...
            </TableCell>
          </TableRow>
        ) : orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
              Nenhuma ordem de serviço encontrada.
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order: any) => {
            const isReady = order.status === "PRONTO_RETIRADA";
            const isPendingApproval = order.status === "AGUARDANDO_APROVACAO" || order.status === "CRIADA";
            const overdue = isReady ? checkDelayedPickup(order.readyAt, order.updatedAt) : null;

            return (
              <TableRow key={order.id}>
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
                      <p className="text-xs font-mono text-muted-foreground">IMEI: {order.device?.imei}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm py-2.5 max-w-xs truncate text-muted-foreground">
                  {order.reportedDefect}
                </TableCell>
                <TableCell className="text-sm py-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={order.status} />
                    {overdue?.isOverdue && (
                      <Badge variant="destructive" className="text-[10px] h-5 px-1.5 gap-1 font-bold animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        Atrasado (+{overdue.daysElapsed > 0 ? `${overdue.daysElapsed}d` : `${overdue.hoursElapsed}h`})
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm py-2.5 text-right font-bold tabular-nums">
                  {formatCurrency(order.grandTotal)}
                </TableCell>
                <TableCell className="text-sm py-2.5 pr-3 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    {order.customer?.phone && (
                      <>
                        {isReady && overdue?.isOverdue && (
                          <a
                            href={getWhatsAppDelayedPickupUrl(order.customer.name, order.customer.phone, order.device?.model || "aparelho")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                            title="Cobrar Retirada no WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Lembrar Cliente
                          </a>
                        )}

                        {isReady && !overdue?.isOverdue && (
                          <a
                            href={getWhatsAppReadyPickupUrl(order.customer.name, order.customer.phone, order.device?.model || "aparelho", order.grandTotal)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            title="Avisar que está pronto"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Avisar Retirada
                          </a>
                        )}

                        {isPendingApproval && order.publicToken && (
                          <a
                            href={getWhatsAppQuoteUrl(order.customer.name, order.customer.phone, order.device?.model || "aparelho", order.publicToken)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            title="Enviar Link de Orçamento no WhatsApp"
                          >
                            <Share2 className="w-3 h-3" />
                            Enviar Link
                          </a>
                        )}
                      </>
                    )}

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md text-xs font-semibold text-primary hover:bg-primary/10 transition-all"
                    >
                      <span>Ver</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
