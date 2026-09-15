"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";

interface CustomersFilterTabsProps {
  currentFilter: string;
  totalCount: number;
}

export function CustomersFilterTabs({ currentFilter, totalCount }: CustomersFilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filterKey === "ALL") {
      params.delete("filter");
    } else {
      params.set("filter", filterKey);
    }
    router.push(`/customers?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border self-start md:self-auto overflow-x-auto">
      <Button
        variant={currentFilter === "ALL" ? "default" : "ghost"}
        size="sm"
        className={`h-7 px-3 text-xs font-medium ${currentFilter === "ALL" ? "shadow-none" : "text-muted-foreground"}`}
        onClick={() => handleSelectFilter("ALL")}
      >
        Todos ({totalCount})
      </Button>
      <Button
        variant={currentFilter === "ACTIVE" ? "default" : "ghost"}
        size="sm"
        className={`h-7 px-3 text-xs font-medium ${currentFilter === "ACTIVE" ? "shadow-none" : "text-muted-foreground"}`}
        onClick={() => handleSelectFilter("ACTIVE")}
      >
        Com OS em Aberto
      </Button>
      <Button
        variant={currentFilter === "RECURRENT" ? "default" : "ghost"}
        size="sm"
        className={`h-7 px-3 text-xs font-medium ${currentFilter === "RECURRENT" ? "shadow-none" : "text-muted-foreground"}`}
        onClick={() => handleSelectFilter("RECURRENT")}
      >
        Recorrentes (2+ OS)
      </Button>
    </div>
  );
}
