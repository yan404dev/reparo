"use client";

import { useTableQueryParams } from "@/hooks/use-table-query-params";

export function useOrdersTableFilters() {
  const { page, setPage, searchParams, setParam, resetFilters } =
    useTableQueryParams();

  const status = searchParams.get("status") || "ALL";
  const period = searchParams.get("period") || "ALL";
  const search = searchParams.get("search") || "";

  return {
    page,
    setPage,
    status,
    period,
    search,
    setStatus: (val: string) => setParam("status", val),
    setPeriod: (val: string) => setParam("period", val),
    setSearch: (val: string) => setParam("search", val),
    resetFilters,
  };
}
