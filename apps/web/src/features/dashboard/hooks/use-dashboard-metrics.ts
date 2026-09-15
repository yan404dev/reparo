"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { DashboardMetrics } from "../types";

export function useDashboardMetrics(): DashboardMetrics {
  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: () => apiRequest("/orders"),
  });

  const { data: parts = [], isLoading: loadingParts } = useQuery({
    queryKey: ["dashboard-parts"],
    queryFn: () => apiRequest("/inventory/parts"),
  });

  const activeOrders = orders.filter(
    (o: any) => o.status !== "FINALIZADA" && o.status !== "CANCELADA"
  );

  const lowStockParts = parts.filter(
    (p: any) => p.stockAvailable <= p.minStockThreshold
  );

  const readyOrders = orders.filter((o: any) => o.status === "PRONTO_RETIRADA");

  const totalRevenue = orders
    .filter((o: any) => o.status === "FINALIZADA" || o.status === "PRONTO_RETIRADA")
    .reduce((acc: number, curr: any) => acc + Number(curr.grandTotal || 0), 0);

  return {
    activeOrders,
    lowStockParts,
    readyOrders,
    totalRevenue,
    orders,
    parts,
    isLoading: loadingOrders || loadingParts,
  };
}
