import React from "react";
import { Card, CardContent } from "@/components/ui";
import { InventoryTable } from "@/features/inventory/components/inventory-table";
import { InventoryFilterTabs } from "@/features/inventory/components/inventory-filter-tabs";
import { InventorySearchInput } from "@/features/inventory/components/inventory-search-input";
import { InventoryActionButtons } from "@/features/inventory/components/inventory-action-buttons";
import { InventoryModalsHost } from "@/features/inventory/components/inventory-modals-host";
import { MovementsHistory } from "@/features/inventory/components/movements-history";
import { serverApiFetch } from "@/lib/server-api";
import { CategoryDTO, PartDTO, StockMovementDTO } from "@fluxos/contracts";

interface InventoryPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    modal?: string;
    partId?: string;
  }>;
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category || "ALL";
  const search = resolvedParams.search || "";

  const queryParams = new URLSearchParams();
  if (categoryFilter !== "ALL") queryParams.append("categoryId", categoryFilter);
  if (search) queryParams.append("search", search);

  const partsEndpoint = `/inventory/parts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const [parts, categories, movements] = await Promise.all([
    serverApiFetch<PartDTO[]>(partsEndpoint).catch(() => []),
    serverApiFetch<CategoryDTO[]>("/categories").catch(() => []),
    serverApiFetch<StockMovementDTO[]>("/inventory/movements").catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight shrink-0">
            Estoque & Peças
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Controle de saldos físicos, precificação dinâmica e categorias de componentes
          </p>
        </div>

        <InventoryActionButtons />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <InventorySearchInput defaultValue={search} />
        <InventoryFilterTabs categories={categories} currentCategory={categoryFilter} />
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5">
          <InventoryTable parts={parts} />
        </CardContent>
      </Card>

      <MovementsHistory movements={movements} isLoading={false} />

      <InventoryModalsHost categories={categories} parts={parts} />
    </div>
  );
}
