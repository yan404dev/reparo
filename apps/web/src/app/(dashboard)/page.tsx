import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KpiMetricCards } from "@/features/dashboard/components/kpi-metric-cards";
import { RecentOrdersCard } from "@/features/dashboard/components/recent-orders-card";
import { LowStockCard } from "@/features/dashboard/components/low-stock-card";
import { serverApiFetch } from "@/lib/server-api";
import { DashboardMetricsDTO } from "@fluxos/contracts";

export default async function DashboardPage() {
  const metrics = await serverApiFetch<DashboardMetricsDTO>("/dashboard/metrics").catch(() => ({
    activeOrdersCount: 0,
    readyOrdersCount: 0,
    lowStockPartsCount: 0,
    totalRevenue: 0,
    displayTotalRevenue: "R$ 0,00",
    recentOrders: [],
    lowStockParts: [],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight shrink-0">Visão Geral</h1>
        <Button size="sm" className="shadow-none" asChild>
          <Link href="/orders/new">Nova Ordem</Link>
        </Button>
      </div>

      <KpiMetricCards metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentOrdersCard orders={metrics.recentOrders} />
        </div>
        <div>
          <LowStockCard parts={metrics.lowStockParts} />
        </div>
      </div>
    </div>
  );
}
