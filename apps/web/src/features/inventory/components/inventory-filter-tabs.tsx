"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryDTO } from "@fluxos/contracts";

interface InventoryFilterTabsProps {
  categories: CategoryDTO[];
  currentCategory: string;
}

export function InventoryFilterTabs({ categories, currentCategory }: InventoryFilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectCategory = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "ALL") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <div className="inline-flex h-9 items-center rounded-md bg-white border border-border p-1 gap-1 overflow-x-auto max-w-full">
      <button
        onClick={() => handleSelectCategory("ALL")}
        className={`h-7 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center ${
          currentCategory === "ALL"
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
        }`}
      >
        Todas as Peças
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelectCategory(cat.id)}
          className={`h-7 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
            currentCategory === cat.id
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
  );
}
