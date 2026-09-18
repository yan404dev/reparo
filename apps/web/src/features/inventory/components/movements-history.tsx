"use client";

import React from "react";
import { formatDate } from "@/lib/utils";
import { StockMovementDTO } from "@fluxos/contracts";
import {
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  TablePaginationFooter,
} from "@/components/ui";


interface MovementsHistoryProps {
  movements: StockMovementDTO[];
  isLoading: boolean;
  meta?: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
}

export function MovementsHistory({ movements, isLoading, meta }: MovementsHistoryProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-4 md:p-5 pb-0 space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Histórico de Movimentações Atômicas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Auditoria cronológica de entradas, reservas, baixas e sucatas</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">Data</TableHead>
              <TableHead className="text-sm">Peça</TableHead>
              <TableHead className="text-sm">Tipo</TableHead>
              <TableHead className="text-sm text-center">Qtd</TableHead>
              <TableHead className="text-sm">Motivo / Referência</TableHead>
              <TableHead className="text-sm pr-3">Operador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                  Carregando histórico de movimentações...
                </TableCell>
              </TableRow>
            ) : movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                  Nenhuma movimentação registrada.
                </TableCell>
              </TableRow>
            ) : (
              movements.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell className="text-sm py-2.5 text-muted-foreground">{formatDate(m.createdAt)}</TableCell>
                  <TableCell className="text-sm py-2.5 font-semibold text-foreground">{m.part?.name}</TableCell>
                  <TableCell className="text-sm py-2.5">
                    <Badge variant="secondary">
                      {m.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm py-2.5 text-center font-bold tabular-nums">
                    <span className={m.quantity > 0 ? "text-green-600" : "text-destructive"}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm py-2.5 text-muted-foreground">
                    {m.reason || (m.serviceOrder ? `OS #${m.serviceOrder.orderNumber}` : "—")}
                  </TableCell>
                  <TableCell className="text-sm py-2.5 pr-3 text-muted-foreground">{m.user?.name}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {meta && (
        <TablePaginationFooter
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
        />
      )}
    </Card>
  );
}

