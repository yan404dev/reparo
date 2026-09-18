import React from "react";
import { StatusText } from "@/components/ui/status-text";

interface CustomerStatusTextProps {
  hasActiveOrders?: boolean;
  isRecurrent?: boolean;
}

export function CustomerStatusText({
  hasActiveOrders,
  isRecurrent,
}: CustomerStatusTextProps) {
  if (hasActiveOrders) {
    return (
      <StatusText
        label="OS em Aberto"
        colorClass="text-amber-600"
      />
    );
  }

  if (isRecurrent) {
    return (
      <StatusText
        label="Recorrente"
        colorClass="text-emerald-600"
      />
    );
  }

  return (
    <StatusText
      label="Sem OS Ativa"
      colorClass="text-neutral-500"
      withDot={false}
    />
  );
}
