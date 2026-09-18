import React from "react";
import { Card, CardContent, TablePaginationFooter } from "@/components/ui";
import { InventoryTable } from "@/features/inventory/components/inventory-table";
import { InventoryTableToolbar } from "@/features/inventory/components/inventory-table-toolbar";
import { InventoryModalsHost } from "@/features/inventory/components/inventory-modals-host";
import { MovementsHistory } from "@/features/inventory/components/movements-history";
import { serverApiFetch } from "@/lib/server-api";
import { CategoryDTO, PartDTO, StockMovementDTO, PaginatedResponseDTO } from "@fluxos/contracts";

interface InventoryPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    search?: string;
    modal?: string;
    partId?: string;
    page?: string;
  }>;
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category || "ALL";
  const statusFilter = resolvedParams.status || "ALL";
  const search = resolvedParams.search || "";
  const page = Math.max(1, Number(resolvedParams.page) || 1);

  const queryParams = new URLSearchParams();
  if (categoryFilter !== "ALL") queryParams.append("categoryId", categoryFilter);
  if (statusFilter !== "ALL") queryParams.append("status", statusFilter);
  if (search) queryParams.append("search", search);
  queryParams.append("page", String(page));
  queryParams.append("limit", "10");

  const partsEndpoint = `/inventory/parts?${queryParams.toString()}`;

  const [partsResponse, categories, movementsResponse] = await Promise.all([
    serverApiFetch<PaginatedResponseDTO<PartDTO>>(partsEndpoint).catch(() => ({
      data: [],
      meta: { page: 1, limit: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
    })),
    serverApiFetch<CategoryDTO[]>("/categories").catch(() => []),
    serverApiFetch<PaginatedResponseDTO<StockMovementDTO>>("/inventory/movements?page=1&limit=10").catch(() => ({
      data: [],
      meta: { page: 1, limit: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
    })),
  ]);

  const parts = partsResponse.data;
  const partsMeta = partsResponse.meta;
  const movements = movementsResponse.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Estoque & Peças
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Controle de saldos físicos, precificação dinâmica e categorias
        </p>
      </div>

      <InventoryTableToolbar categories={categories} initialSearch={search} />

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5 pb-0">
          <InventoryTable parts={parts} />
        </CardContent>
        <TablePaginationFooter
          page={partsMeta.page}
          totalPages={partsMeta.totalPages}
          totalItems={partsMeta.totalItems}
        />
      </Card>

      <MovementsHistory movements={movements} isLoading={false} />
      <InventoryModalsHost categories={categories} parts={parts} />
    </div>
  );
}

