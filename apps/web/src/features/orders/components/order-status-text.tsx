import React from "react";
import { OrderStatus } from "@fluxos/contracts";
import { StatusText } from "@/components/ui/status-text";

interface OrderStatusTextProps {
  status: OrderStatus | string;
  className?: string;
}

const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; colorClass: string }
> = {
  CRIADA: { label: "Criada", colorClass: "text-neutral-600" },
  AGUARDANDO_APROVACAO: {
    label: "Aguardando Aprovação",
    colorClass: "text-amber-600",
  },
  APROVADA: { label: "Aprovada", colorClass: "text-blue-600" },
  EM_REPARO: { label: "Em Bancada", colorClass: "text-indigo-600" },
  TESTES_FINAIS: { label: "Testes Finais", colorClass: "text-purple-600" },
  PRONTO_RETIRADA: {
    label: "Pronto p/ Retirada",
    colorClass: "text-emerald-600",
  },
  FINALIZADA: { label: "Finalizada", colorClass: "text-emerald-700" },
  CANCELADA: { label: "Cancelada", colorClass: "text-rose-600" },
};

export function OrderStatusText({ status, className }: OrderStatusTextProps) {
  const conf = ORDER_STATUS_CONFIG[status] || {
    label: status,
    colorClass: "text-neutral-600",
  };

  return (
    <StatusText
      label={conf.label}
      colorClass={conf.colorClass}
      className={className}
    />
  );
}
