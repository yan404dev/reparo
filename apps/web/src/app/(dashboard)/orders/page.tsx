import React from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { OrdersTable } from "@/features/orders/components/orders-table";
import { OrdersFilterTabs } from "@/features/orders/components/orders-filter-tabs";
import { OrdersSearchInput } from "@/features/orders/components/orders-search-input";
import { serverApiFetch } from "@/lib/server-api";
import { ServiceOrderDTO } from "@fluxos/contracts";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status || "ALL";
  const search = resolvedParams.search || "";

  const queryParams = new URLSearchParams();
  if (statusFilter !== "ALL") queryParams.append("status", statusFilter);
  if (search) queryParams.append("search", search);

  const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const orders = await serverApiFetch<ServiceOrderDTO[]>(endpoint).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight shrink-0">
          Ordens de Serviço
        </h1>
        <Button size="sm" className="shadow-none" asChild>
          <Link href="/orders/new">Nova Ordem</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <OrdersSearchInput defaultValue={search} />
        <OrdersFilterTabs currentStatus={statusFilter} />
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5">
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
