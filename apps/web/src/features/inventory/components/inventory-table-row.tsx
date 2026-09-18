import React from "react";
import { Package, Barcode } from "lucide-react";
import { PartDTO } from "@fluxos/contracts";
import { TableRow, TableCell } from "@/components/ui";
import { InventoryTableActions } from "./inventory-table-actions";
import { InventoryStockStatus } from "./inventory-stock-status";

interface InventoryTableRowProps {
  part: PartDTO;
  onOpenEntry?: (part: PartDTO) => void;
  onOpenScrap?: (part: PartDTO) => void;
}

export function InventoryTableRow({
  part,
  onOpenEntry,
  onOpenScrap,
}: InventoryTableRowProps) {
  const categoryName =
    typeof part.category === "object" ? part.category?.name : part.category;

  return (
    <TableRow>
      <TableCell className="text-sm py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-muted text-primary flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{part.name}</p>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span>SKU: {part.sku}</span>
              {part.barcode && (
                <span className="flex items-center gap-0.5">
                  <Barcode className="w-3 h-3" />
                  {part.barcode}
                </span>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm py-2.5 text-muted-foreground font-medium">
        {categoryName || "Geral"}
      </TableCell>
      <TableCell className="text-sm py-2.5 text-right tabular-nums">
        R$ {Number(part.costPrice || 0).toFixed(2)}
      </TableCell>
      <TableCell className="text-sm py-2.5 text-right tabular-nums">
        R$ {Number(part.sellingPrice || 0).toFixed(2)}
      </TableCell>
      <TableCell className="text-sm py-2.5 text-center font-bold tabular-nums">
        {part.stockAvailable}
      </TableCell>
      <TableCell className="text-sm py-2.5 text-center">
        <InventoryStockStatus
          available={part.stockAvailable}
          minThreshold={part.minStockThreshold}
          isLowStock={part.isLowStock}
        />
      </TableCell>
      <TableCell className="text-sm py-2.5 pr-3 text-right">
        <InventoryTableActions
          part={part}
          onOpenEntry={onOpenEntry}
          onOpenScrap={onOpenScrap}
        />
      </TableCell>
    </TableRow>
  );
}
