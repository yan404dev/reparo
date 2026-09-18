import React from "react";
import { Card, CardContent, TablePaginationFooter } from "@/components/ui";
import { OrdersTable } from "@/features/orders/components/orders-table";
import { OrdersTableToolbar } from "@/features/orders/components/orders-table-toolbar";
import { serverApiFetch } from "@/lib/server-api";
import { ServiceOrderDTO, PaginatedResponseDTO } from "@fluxos/contracts";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    period?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status || "ALL";
  const periodFilter = resolvedParams.period || "ALL";
  const search = resolvedParams.search || "";
  const page = Math.max(1, Number(resolvedParams.page) || 1);

  const queryParams = new URLSearchParams();
  if (statusFilter !== "ALL") queryParams.append("status", statusFilter);
  if (periodFilter !== "ALL") queryParams.append("period", periodFilter);
  if (search) queryParams.append("search", search);
  queryParams.append("page", String(page));
  queryParams.append("limit", "10");

  const endpoint = `/orders?${queryParams.toString()}`;
  const response = await serverApiFetch<PaginatedResponseDTO<ServiceOrderDTO>>(endpoint).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
  }));

  const orders = response.data;
  const { meta } = response;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Ordens de Serviço
        </h1>
      </div>

      <OrdersTableToolbar initialSearch={search} />

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5 pb-0">
          <OrdersTable orders={orders} />
        </CardContent>
        <TablePaginationFooter
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
        />
      </Card>
    </div>
  );
}

