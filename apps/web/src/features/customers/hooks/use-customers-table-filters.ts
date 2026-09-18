"use client";

import { useTableQueryParams } from "@/hooks/use-table-query-params";

export function useCustomersTableFilters() {
  const { page, setPage, searchParams, setParam, resetFilters } =
    useTableQueryParams();

  const filter = searchParams.get("filter") || "ALL";
  const search = searchParams.get("search") || "";

  return {
    page,
    setPage,
    filter,
    search,
    setFilter: (val: string) => setParam("filter", val),
    setSearch: (val: string) => setParam("search", val),
    resetFilters,
  };
}
