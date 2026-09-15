"use client";

import React from "react";
import { Search, PackagePlus, Tags } from "lucide-react";
import { Input, Card, CardContent, Button } from "@/components/ui";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { InventoryTable } from "@/features/inventory/components/inventory-table";
import { StockEntryModal } from "@/features/inventory/components/stock-entry-modal";
import { StockScrapModal } from "@/features/inventory/components/stock-scrap-modal";
import { MovementsHistory } from "@/features/inventory/components/movements-history";
import { CategoryManagerModal } from "@/features/inventory/components/category-manager-modal";
import { CreatePartModal } from "@/features/inventory/components/create-part-modal";

export default function InventoryPage() {
  const {
    parts,
    movements,
    categories,
    loadingParts,
    loadingMovements,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    selectedPart,
    showEntryModal,
    setShowEntryModal,
    showScrapModal,
    setShowScrapModal,
    showCategoryModal,
    setShowCategoryModal,
    showCreatePartModal,
    setShowCreatePartModal,
    openEntryModal,
    openScrapModal,
  } = useInventory();

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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCategoryModal(true)}
            className="h-9 text-xs font-semibold gap-1.5 shadow-none"
          >
            <Tags className="w-3.5 h-3.5 text-muted-foreground" />
            Categorias
          </Button>
          <Button
            onClick={() => setShowCreatePartModal(true)}
            className="h-9 text-xs font-semibold gap-1.5 shadow-none"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            Nova Peça
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por SKU, nome ou código..."
            className="h-9 pl-8 pr-3 text-sm w-full"
          />
        </div>

        <div className="inline-flex h-9 items-center rounded-md bg-white border border-border p-1 gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`h-7 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center ${
              categoryFilter === "ALL"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
            }`}
          >
            Todas as Peças
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`h-7 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
                categoryFilter === cat.id
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5">
          <InventoryTable
            parts={parts}
            isLoading={loadingParts}
            onOpenEntry={openEntryModal}
            onOpenScrap={openScrapModal}
          />
        </CardContent>
      </Card>

      <MovementsHistory movements={movements} isLoading={loadingMovements} />

      {showCategoryModal && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {showCreatePartModal && (
        <CreatePartModal
          categories={categories}
          onClose={() => setShowCreatePartModal(false)}
        />
      )}

      {showEntryModal && selectedPart && (
        <StockEntryModal
          part={selectedPart}
          onClose={() => setShowEntryModal(false)}
        />
      )}

      {showScrapModal && selectedPart && (
        <StockScrapModal
          part={selectedPart}
          onClose={() => setShowScrapModal(false)}
        />
      )}
    </div>
  );
}
