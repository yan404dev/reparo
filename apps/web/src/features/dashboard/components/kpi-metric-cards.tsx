import React from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { DashboardMetricsDTO } from "@fluxos/contracts";

interface KpiMetricCardsProps {
  metrics: DashboardMetricsDTO;
}

export function KpiMetricCards({ metrics }: KpiMetricCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
      <KpiCard
        title="OS EM ANDAMENTO"
        value={String(metrics.activeOrdersCount)}
        subtitle="Na bancada técnica"
      />
      <KpiCard
        title="ESTOQUE CRÍTICO"
        value={String(metrics.lowStockPartsCount)}
        subtitle="Alerta de reposição"
      />
      <KpiCard
        title="PRONTOS P/ RETIRADA"
        value={String(metrics.readyOrdersCount)}
        subtitle="Aguardando cliente"
      />
      <KpiCard
        title="FATURAMENTO REALIZADO"
        value={metrics.displayTotalRevenue}
        subtitle="Ordens concluídas"
      />
    </div>
  );
}
