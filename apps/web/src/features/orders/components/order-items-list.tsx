"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
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

interface OrderItemsListProps {
  order: ServiceOrderDTO;
  onRemoveItem: (id: string) => void;
  canEdit: boolean;
}

export function OrderItemsList({ order, onRemoveItem, canEdit }: OrderItemsListProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm">Tipo</TableHead>
            <TableHead className="text-sm">Descrição / Componente</TableHead>
            <TableHead className="text-sm text-center">Qtd</TableHead>
            <TableHead className="text-sm text-right">Valor Un.</TableHead>
            <TableHead className="text-sm text-right">Total</TableHead>
            <TableHead className="text-sm text-center">Garantia</TableHead>
            <TableHead className="text-sm pr-3 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                Nenhum item incluído no orçamento.
              </TableCell>
            </TableRow>
          ) : (
            order.items?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="text-sm py-2.5">
                  <Badge variant={item.type === "PECA" ? "default" : "secondary"}>
                    {item.type === "PECA" ? "PEÇA" : "SERVIÇO"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm py-2.5">
                  <p className="font-semibold text-foreground">{item.description}</p>
                  {item.part && (
                    <p className="text-xs font-mono text-muted-foreground">SKU: {item.part.sku}</p>
                  )}
                </TableCell>
                <TableCell className="text-sm py-2.5 text-center font-bold tabular-nums">{item.quantity}</TableCell>
                <TableCell className="text-sm py-2.5 text-right tabular-nums text-muted-foreground">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="text-sm py-2.5 text-right font-bold tabular-nums text-foreground">
                  {formatCurrency(item.total)}
                </TableCell>
                <TableCell className="text-sm py-2.5 text-center">
                  <Badge variant="success">
                    {item.warrantyDays} dias
                  </Badge>
                </TableCell>
                <TableCell className="text-sm py-2.5 pr-3 text-right">
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="pt-4 border-t border-border flex flex-col items-end space-y-1.5 text-xs">
        <div className="flex justify-between w-64 text-muted-foreground">
          <span>Subtotal Peças:</span>
          <span className="tabular-nums font-medium">{formatCurrency(order.totalPartsPrice)}</span>
        </div>
        <div className="flex justify-between w-64 text-muted-foreground">
          <span>Subtotal Mão de Obra:</span>
          <span className="tabular-nums font-medium">{formatCurrency(order.totalLaborPrice)}</span>
        </div>
        <div className="flex justify-between w-64 text-foreground font-bold text-sm pt-2 border-t border-border">
          <span>Total do Orçamento:</span>
          <span className="tabular-nums">{formatCurrency(order.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
