"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Users, ChevronRight, Smartphone } from "lucide-react";
import { CustomerDTO } from "@fluxos/contracts";
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

interface CustomersTableProps {
  customers: CustomerDTO[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-sm font-semibold">Cliente</TableHead>
          <TableHead className="text-sm font-semibold">CPF / Documento</TableHead>
          <TableHead className="text-sm font-semibold">Contato</TableHead>
          <TableHead className="text-sm font-semibold text-center">Aparelhos</TableHead>
          <TableHead className="text-sm font-semibold text-center">Histórico OS</TableHead>
          <TableHead className="text-sm font-semibold text-right">Total Investido</TableHead>
          <TableHead className="text-sm pr-3 text-right">Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
              Nenhum cliente encontrado com os filtros atuais.
            </TableCell>
          </TableRow>
        ) : (
          customers.map((c) => {
            const orderCount = c._count?.orders ?? c.orders?.length ?? 0;

            return (
              <TableRow
                key={c.id}
                onClick={() => router.push(`/customers/${c.id}`)}
                className="cursor-pointer hover:bg-muted/60 transition-colors group"
              >
                <TableCell className="text-sm py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20">
                      {c.name ? c.name.charAt(0).toUpperCase() : <Users className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {c.name}
                        </p>
                        {c.isRecurrent && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-blue-50 text-blue-700 border-blue-200">
                            Recorrente
                          </Badge>
                        )}
                        {c.hasActiveOrders && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200 animate-pulse">
                            OS em Andamento
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.email || "Sem e-mail cadastrado"}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm py-3 font-mono font-medium text-foreground">
                  {c.displayDocument || "—"}
                </TableCell>

                <TableCell className="text-sm py-3 text-foreground">
                  <span className="font-medium">{c.phone}</span>
                </TableCell>

                <TableCell className="text-sm py-3 text-center">
                  <div className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted px-2 py-0.5 rounded text-xs">
                    <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{c.devices?.length || 0}</span>
                  </div>
                </TableCell>

                <TableCell className="text-sm py-3 text-center">
                  <Badge variant={orderCount > 0 ? "secondary" : "outline"} className="tabular-nums font-semibold">
                    {orderCount} {orderCount === 1 ? "OS" : "OSs"}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm py-3 text-right font-medium text-foreground tabular-nums">
                  {c.displayTotalSpent || "R$ 0,00"}
                </TableCell>

                <TableCell className="text-sm py-3 pr-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 gap-1"
                    onClick={() => router.push(`/customers/${c.id}`)}
                  >
                    <span>Timelapse</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
