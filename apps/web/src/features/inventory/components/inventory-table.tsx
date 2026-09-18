import React from "react";
import { PartDTO } from "@fluxos/contracts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import { InventoryTableRow } from "./inventory-table-row";

interface InventoryTableProps {
  parts: PartDTO[];
  onOpenEntry?: (part: PartDTO) => void;
  onOpenScrap?: (part: PartDTO) => void;
}

export function InventoryTable({
  parts,
  onOpenEntry,
  onOpenScrap,
}: InventoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-sm">Peça / SKU</TableHead>
          <TableHead className="text-sm">Categoria</TableHead>
          <TableHead className="text-sm text-right">Custo</TableHead>
          <TableHead className="text-sm text-right">Preço Venda</TableHead>
          <TableHead className="text-sm text-center">Disponível</TableHead>
          <TableHead className="text-sm text-center">Status</TableHead>
          <TableHead className="text-sm text-right pr-3">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parts.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-sm text-muted-foreground py-12"
            >
              Nenhuma peça cadastrada.
            </TableCell>
          </TableRow>
        ) : (
          parts.map((part) => (
            <InventoryTableRow
              key={part.id}
              part={part}
              onOpenEntry={onOpenEntry}
              onOpenScrap={onOpenScrap}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}
