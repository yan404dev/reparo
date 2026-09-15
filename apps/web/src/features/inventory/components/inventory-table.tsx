"use client";

import React from "react";
import { Package, ArrowUpRight, ShieldAlert, AlertTriangle, Barcode } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PartDTO } from "@fluxos/contracts";
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

interface InventoryTableProps {
  parts: PartDTO[];
  isLoading: boolean;
  onOpenEntry: (part: PartDTO) => void;
  onOpenScrap: (part: PartDTO) => void;
}

export function InventoryTable({ parts, isLoading, onOpenEntry, onOpenScrap }: InventoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-sm">Peça / SKU</TableHead>
          <TableHead className="text-sm">Categoria</TableHead>
          <TableHead className="text-sm text-right">Custo Médio</TableHead>
          <TableHead className="text-sm text-right">Markup</TableHead>
          <TableHead className="text-sm text-right">Preço Venda</TableHead>
          <TableHead className="text-sm text-center">Físico</TableHead>
          <TableHead className="text-sm text-center">Reservado</TableHead>
          <TableHead className="text-sm text-center">Disponível</TableHead>
          <TableHead className="text-sm text-right pr-3">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-12">
              Carregando catálogo de peças...
            </TableCell>
          </TableRow>
        ) : parts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-12">
              Nenhuma peça cadastrada.
            </TableCell>
          </TableRow>
        ) : (
          parts.map((part) => {
            const isLow = part.stockAvailable <= part.minStockThreshold;
            const categoryName = typeof part.category === "object" ? part.category?.name : part.category;
            const categoryColor = typeof part.category === "object" ? part.category?.color : "#3b82f6";

            return (
              <TableRow key={part.id}>
                <TableCell className="text-sm py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-muted text-primary flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{part.name}</p>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span>{part.sku}</span>
                        {part.barcode && (
                          <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground/80">
                            <Barcode className="w-3 h-3" />
                            {part.barcode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm py-2.5">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: `${categoryColor || "#3b82f6"}15`,
                      color: categoryColor || "#3b82f6",
                      borderColor: `${categoryColor || "#3b82f6"}30`,
                    }}
                  >
                    {categoryName || "Geral"}
                  </span>
                </TableCell>

                <TableCell className="text-sm py-2.5 text-right tabular-nums text-muted-foreground">
                  {formatCurrency(part.costPrice)}
                </TableCell>

                <TableCell className="text-sm py-2.5 text-right tabular-nums text-muted-foreground font-medium">
                  {part.suggestedMarkupPercent ? `+${part.suggestedMarkupPercent}%` : "—"}
                </TableCell>

                <TableCell className="text-sm py-2.5 text-right font-bold tabular-nums text-foreground">
                  {formatCurrency(part.sellingPrice)}
                </TableCell>

                <TableCell className="text-sm py-2.5 text-center font-bold tabular-nums text-foreground">
                  {part.stockPhysical}
                </TableCell>

                <TableCell className="text-sm py-2.5 text-center font-bold tabular-nums text-amber-600">
                  {part.stockReserved}
                </TableCell>

                <TableCell className="text-sm py-2.5 text-center">
                  <Badge variant={isLow ? "destructive" : "success"}>
                    {isLow && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {part.stockAvailable} un.
                  </Badge>
                </TableCell>

                <TableCell className="text-sm py-2.5 pr-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onOpenEntry(part)}
                      title="Registrar Entrada de Lote"
                      className="h-7 w-7 rounded-md shadow-none"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onOpenScrap(part)}
                      title="Baixa por Avaria Técnica / Sucata"
                      className="h-7 w-7 rounded-md shadow-none text-destructive hover:text-destructive"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </Button>
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
