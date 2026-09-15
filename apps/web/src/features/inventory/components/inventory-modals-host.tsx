"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryDTO, PartDTO } from "@fluxos/contracts";
import { CategoryManagerModal } from "./category-manager-modal";
import { CreatePartModal } from "./create-part-modal";
import { StockEntryModal } from "./stock-entry-modal";
import { StockScrapModal } from "./stock-scrap-modal";

interface InventoryModalsHostProps {
  categories: CategoryDTO[];
  parts: PartDTO[];
}

export function InventoryModalsHost({ categories, parts }: InventoryModalsHostProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const modal = searchParams.get("modal");
  const partId = searchParams.get("partId");

  const selectedPart = partId ? parts.find((p) => p.id === partId) : null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("partId");
    const query = params.toString();
    router.push(query ? `/inventory?${query}` : "/inventory");
  };

  if (!modal) return null;

  return (
    <>
      {modal === "categories" && (
        <CategoryManagerModal
          categories={categories}
          onClose={handleClose}
        />
      )}

      {modal === "new-part" && (
        <CreatePartModal
          categories={categories}
          onClose={handleClose}
        />
      )}

      {modal === "stock-entry" && selectedPart && (
        <StockEntryModal
          part={selectedPart}
          onClose={handleClose}
        />
      )}

      {modal === "stock-scrap" && selectedPart && (
        <StockScrapModal
          part={selectedPart}
          onClose={handleClose}
        />
      )}
    </>
  );
}
