"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface UseTableQueryParamsOptions {
  pageParamName?: string;
}

export function useTableQueryParams(options?: UseTableQueryParamsOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParamName = options?.pageParamName ?? "page";

  const page = useMemo(() => {
    const raw = searchParams.get(pageParamName);
    const parsed = raw ? parseInt(raw, 10) : 1;
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [searchParams, pageParamName]);

  const setParam = useCallback(
    (name: string, value?: string | null, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "ALL") {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      if (resetPage) {
        params.delete(pageParamName);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, pageParamName]
  );

  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage <= 1) {
        params.delete(pageParamName);
      } else {
        params.set(pageParamName, newPage.toString());
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, pageParamName]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    page,
    setPage,
    searchParams,
    setParam,
    resetFilters,
  };
}
