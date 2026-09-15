import React from "react";
import { OrderStatus } from "@fluxos/contracts";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  CRIADA: {
    label: "Criada",
    bg: "bg-neutral-100",
    text: "text-neutral-700",
    dot: "bg-neutral-400",
    border: "border-neutral-200",
  },
  AGUARDANDO_APROVACAO: {
    label: "Aguardando Aprovação",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200/70",
  },
  APROVADA: {
    label: "Aprovada (Peças Reservadas)",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200/70",
  },
  EM_REPARO: {
    label: "Em Bancada",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-600",
    border: "border-indigo-200/70",
  },
  TESTES_FINAIS: {
    label: "Testes Finais",
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
    border: "border-purple-200/70",
  },
  PRONTO_RETIRADA: {
    label: "Pronto p/ Retirada",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200/70",
  },
  FINALIZADA: {
    label: "Garantia 90d Ativa",
    bg: "bg-emerald-100/70",
    text: "text-emerald-800",
    dot: "bg-emerald-600",
    border: "border-emerald-300/80",
  },
  CANCELADA: {
    label: "Cancelada",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    border: "border-rose-200/70",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const conf = statusConfig[status] || {
    label: status,
    bg: "bg-neutral-50",
    text: "text-neutral-700",
    dot: "bg-neutral-400",
    border: "border-neutral-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors",
        conf.bg,
        conf.text,
        conf.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", conf.dot)} />
      {conf.label}
    </span>
  );
}

export { StatusBadge as OrderStatusBadge };
