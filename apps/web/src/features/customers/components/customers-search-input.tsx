"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui";

interface CustomersSearchInputProps {
  defaultValue?: string;
}

export function CustomersSearchInput({ defaultValue = "" }: CustomersSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.replace(`/customers?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar por nome, CPF ou celular..."
        className="h-9 pl-8 pr-3 text-sm w-full"
      />
    </div>
  );
}
