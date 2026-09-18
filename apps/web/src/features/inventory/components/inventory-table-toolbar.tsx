"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CategoryDTO } from "@fluxos/contracts";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableToolbarContainer,
} from "@/components/ui";
import { InventorySearchInput } from "./inventory-search-input";
import { useInventoryTableFilters } from "../hooks/use-inventory-table-filters";

interface InventoryTableToolbarProps {
  categories: CategoryDTO[];
  initialSearch?: string;
}

export function InventoryTableToolbar({
  categories,
  initialSearch = "",
}: InventoryTableToolbarProps) {
  const { category, status, setCategory, setStatus } = useInventoryTableFilters();

  return (
    <TableToolbarContainer
      left={
        <>
          <InventorySearchInput defaultValue={initialSearch} />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-sm">
                Todas as categorias
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-sm">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Status do estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-sm">
                Todos os status
              </SelectItem>
              <SelectItem value="IN_STOCK" className="text-sm">
                Em Estoque
              </SelectItem>
              <SelectItem value="LOW_STOCK" className="text-sm">
                Estoque Baixo
              </SelectItem>
              <SelectItem value="OUT_OF_STOCK" className="text-sm">
                Sem Estoque
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      right={
        <Button size="sm" asChild>
          <Link href="/inventory?modal=new">
            <Plus className="w-4 h-4 mr-1.5" />
            Nova peça
          </Link>
        </Button>
      }
    />
  );
}
