import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiMetricCards } from "@/features/dashboard/components/kpi-metric-cards";
import { RecentOrdersCard } from "@/features/dashboard/components/recent-orders-card";
import { LowStockCard } from "@/features/dashboard/components/low-stock-card";
import { ShareIntakeLinkButton } from "@/features/dashboard/components/share-intake-link-button";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Visão Geral
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acompanhe a movimentação da bancada técnica e alertas de estoque
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ShareIntakeLinkButton />
          <Button size="sm" className="shadow-none h-9 text-sm font-medium gap-1.5" asChild>
            <Link href="/orders/new">
              <Plus className="w-4 h-4" />
              <span>Nova ordem de serviço</span>
            </Link>
          </Button>
        </div>
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
