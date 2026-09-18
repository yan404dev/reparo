"use client";

import React from "react";
import { ServerPagination } from "@/components/ui/server-pagination";
import { useTablePagination } from "@/hooks/use-table-pagination";

interface TablePaginationFooterProps {
  page: number;
  totalPages: number;
  totalItems: number;
  className?: string;
}

export function TablePaginationFooter({
  page,
  totalPages,
  totalItems,
  className = "",
}: TablePaginationFooterProps) {
  const { setPage } = useTablePagination();

  if (totalItems <= 0) return null;

  return (
    <div className={`border-t border-border px-4 py-2 ${className}`.trim()}>
      <ServerPagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
      />
    </div>
  );
}
