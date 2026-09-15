"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { CategoryDTO, PartDTO, StockMovementDTO } from "@fluxos/contracts";

export function useInventory() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedPart, setSelectedPart] = useState<PartDTO | null>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showScrapModal, setShowScrapModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCreatePartModal, setShowCreatePartModal] = useState(false);

  const { data: categories = [], isLoading: loadingCategories } = useQuery<CategoryDTO[]>({
    queryKey: ["categories"],
    queryFn: () => apiRequest("/categories"),
  });

  const { data: parts = [], isLoading: loadingParts } = useQuery<PartDTO[]>({
    queryKey: ["inventory-parts", categoryFilter, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (categoryFilter !== "ALL") params.append("categoryId", categoryFilter);
      if (search) params.append("search", search);
      return apiRequest(`/inventory/parts?${params.toString()}`);
    },
  });

  const { data: movements = [], isLoading: loadingMovements } = useQuery<StockMovementDTO[]>({
    queryKey: ["inventory-movements"],
    queryFn: () => apiRequest("/inventory/movements"),
  });

  const openEntryModal = (part: PartDTO) => {
    setSelectedPart(part);
    setShowEntryModal(true);
  };

  const openScrapModal = (part: PartDTO) => {
    setSelectedPart(part);
    setShowScrapModal(true);
  };

  return {
    parts,
    movements,
    categories,
    loadingParts,
    loadingMovements,
    loadingCategories,
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
  };
}
