"use client";

import { useTableQueryParams } from "@/hooks/use-table-query-params";

export function useInventoryTableFilters() {
  const { page, setPage, searchParams, setParam, resetFilters } =
    useTableQueryParams();

  const category = searchParams.get("category") || "ALL";
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";

  return {
    page,
    setPage,
    category,
    status,
    search,
    setCategory: (val: string) => setParam("category", val),
    setStatus: (val: string) => setParam("status", val),
    setSearch: (val: string) => setParam("search", val),
    resetFilters,
  };
}
