"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STATUS_TABS = [
  { id: "ALL", label: "Todas" },
  { id: "CRIADA", label: "Criadas" },
  { id: "AGUARDANDO_APROVACAO", label: "Aguardando Aprovação" },
  { id: "APROVADA", label: "Aprovadas" },
  { id: "EM_REPARO", label: "Em Bancada" },
  { id: "TESTES_FINAIS", label: "Testes" },
  { id: "PRONTO_RETIRADA", label: "Pronto" },
  { id: "FINALIZADA", label: "Finalizadas" },
];

interface OrdersFilterTabsProps {
  currentStatus: string;
}

export function OrdersFilterTabs({ currentStatus }: OrdersFilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectTab = (statusId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (statusId === "ALL") {
      params.delete("status");
    } else {
      params.set("status", statusId);
    }
    router.push(`/orders?${params.toString()}`);
  };

  return (
    <div className="inline-flex h-9 items-center rounded-md bg-white border border-border p-1 gap-1 overflow-x-auto max-w-full">
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleSelectTab(tab.id)}
          className={`h-7 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center ${
            currentStatus === tab.id
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
