import React from "react";
import { KpiCard } from "@/components/ui/kpi-card";

interface CustomersKpiCardsProps {
  totalCustomers: number;
  recurrentCount: number;
  activeOrdersSum: number;
  displayTotalSpentSum: string;
}

export function CustomersKpiCards({
  totalCustomers,
  recurrentCount,
  activeOrdersSum,
  displayTotalSpentSum,
}: CustomersKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
      <KpiCard
        title="TOTAL DE CLIENTES"
        value={String(totalCustomers)}
        subtitle="Base cadastrada"
      />
      <KpiCard
        title="CLIENTES RECORRENTES"
        value={String(recurrentCount)}
        subtitle="Mais de 1 atendimento"
      />
      <KpiCard
        title="OSs EM ANDAMENTO"
        value={String(activeOrdersSum)}
        subtitle="Aparelhos na bancada"
      />
      <KpiCard
        title="FATURAMENTO ACUMULADO"
        value={displayTotalSpentSum}
        subtitle="Receita total gerada"
      />
    </div>
  );
}
