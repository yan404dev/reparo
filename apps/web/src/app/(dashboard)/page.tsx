"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";
import { KpiMetricCards } from "@/features/dashboard/components/kpi-metric-cards";
import { RecentOrdersCard } from "@/features/dashboard/components/recent-orders-card";
import { LowStockCard } from "@/features/dashboard/components/low-stock-card";

export default function DashboardPage() {
  const metrics = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight shrink-0">Visão Geral</h1>
        <Button size="sm" className="shadow-none" asChild>
          <Link href="/orders">
            Nova Ordem
          </Link>
        </Button>
      </div>

      <KpiMetricCards metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentOrdersCard orders={metrics.orders} isLoading={metrics.isLoading} />
        </div>
        <div>
          <LowStockCard parts={metrics.parts} isLoading={metrics.isLoading} />
        </div>
      </div>
    </div>
  );
}
