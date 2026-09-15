import React from "react";
import Link from "next/link";
import { Smartphone, ChevronRight, MessageCircle, AlertCircle, Share2 } from "lucide-react";
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
} from "@/components/ui";

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
            <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
              Nenhuma ordem de serviço encontrada.
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => {
            const isReady = order.status === "PRONTO_RETIRADA";
            const isPendingApproval = order.status === "AGUARDANDO_APROVACAO" || order.status === "CRIADA";

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
                    {order.isLateDelivery && (
                      <Badge variant="destructive" className="text-[10px] h-5 px-1.5 gap-1 font-bold animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        Atrasado (+{order.daysLate > 0 ? `${order.daysLate}d` : `${order.hoursLate}h`})
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm py-2.5 text-right font-bold tabular-nums">
                  {order.displayTotalPrice}
                </TableCell>
                <TableCell className="text-sm py-2.5 pr-3 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    {order.whatsappUrl && (
                      <a
                        href={order.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-semibold text-white transition-colors ${
                          order.isLateDelivery
                            ? "bg-amber-500 hover:bg-amber-600"
                            : isReady
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                        title="Ação rápida no WhatsApp"
                      >
                        {isPendingApproval ? (
                          <>
                            <Share2 className="w-3 h-3" />
                            <span>Enviar Link</span>
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-3 h-3" />
                            <span>{order.isLateDelivery ? "Lembrar Cliente" : "Avisar Retirada"}</span>
                          </>
                        )}
                      </a>
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
