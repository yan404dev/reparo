"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { KpiCard } from "@/components/ui/kpi-card";
import { DashboardMetrics } from "../types";

interface KpiMetricCardsProps {
  metrics: DashboardMetrics;
}

export function KpiMetricCards({ metrics }: KpiMetricCardsProps) {
  const { activeOrders, lowStockParts, readyOrders, totalRevenue, isLoading } = metrics;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
      <KpiCard
        title="OS EM ANDAMENTO"
        value={isLoading ? "—" : String(activeOrders.length)}
        subtitle="Na bancada técnica"
      />
      <KpiCard
        title="ESTOQUE CRÍTICO"
        value={isLoading ? "—" : String(lowStockParts.length)}
        subtitle="Alerta de reposição"
      />
      <KpiCard
        title="PRONTOS P/ RETIRADA"
        value={isLoading ? "—" : String(readyOrders.length)}
        subtitle="Aguardando cliente"
      />
      <KpiCard
        title="FATURAMENTO REALIZADO"
        value={isLoading ? "—" : formatCurrency(totalRevenue)}
        subtitle="Ordens concluídas"
      />
    </div>
  );
}
