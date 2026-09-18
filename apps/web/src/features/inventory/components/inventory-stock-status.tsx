import React from "react";
import { StatusText } from "@/components/ui/status-text";

interface InventoryStockStatusProps {
  available: number;
  minThreshold: number;
  isLowStock?: boolean;
}

export function InventoryStockStatus({
  available,
  minThreshold,
  isLowStock,
}: InventoryStockStatusProps) {
  const isOut = available <= 0;
  const isLow = isLowStock ?? available <= minThreshold;

  if (isOut) {
    return (
      <StatusText
        label="Sem Estoque"
        colorClass="text-rose-600"
      />
    );
  }

  if (isLow) {
    return (
      <StatusText
        label="Estoque Baixo"
        colorClass="text-amber-600"
      />
    );
  }

  return (
    <StatusText
      label="Em Estoque"
      colorClass="text-emerald-600"
    />
  );
}
