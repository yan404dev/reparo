"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableToolbarContainer,
} from "@/components/ui";
import { CustomersSearchInput } from "./customers-search-input";
import { useCustomersTableFilters } from "../hooks/use-customers-table-filters";

interface CustomersTableToolbarProps {
  initialSearch?: string;
}

export function CustomersTableToolbar({ initialSearch = "" }: CustomersTableToolbarProps) {
  const { filter, setFilter } = useCustomersTableFilters();

  return (
    <TableToolbarContainer
      left={
        <>
          <CustomersSearchInput defaultValue={initialSearch} />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[190px] h-9 text-sm">
              <SelectValue placeholder="Filtro de clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-sm">
                Todos os clientes
              </SelectItem>
              <SelectItem value="ACTIVE" className="text-sm">
                Com OS em Aberto
              </SelectItem>
              <SelectItem value="RECURRENT" className="text-sm">
                Clientes Recorrentes
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      right={
        <Button size="sm" asChild>
          <Link href="/customers/new">
            <Plus className="w-4 h-4 mr-1.5" />
            Novo cliente
          </Link>
        </Button>
      }
    />
  );
}
