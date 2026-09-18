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
import { OrdersSearchInput } from "./orders-search-input";
import { useOrdersTableFilters } from "../hooks/use-orders-table-filters";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos os Status" },
  { value: "CRIADA", label: "Criada" },
  { value: "AGUARDANDO_APROVACAO", label: "Aguardando Aprovação" },
  { value: "APROVADA", label: "Aprovada" },
  { value: "EM_REPARO", label: "Em Bancada" },
  { value: "TESTES_FINAIS", label: "Testes Finais" },
  { value: "PRONTO_RETIRADA", label: "Pronto Retirada" },
  { value: "FINALIZADA", label: "Finalizada" },
];

const PERIOD_OPTIONS = [
  { value: "ALL", label: "Todo o Período" },
  { value: "TODAY", label: "Hoje" },
  { value: "LAST_7_DAYS", label: "Últimos 7 dias" },
  { value: "THIS_MONTH", label: "Este Mês" },
];

interface OrdersTableToolbarProps {
  initialSearch?: string;
}

export function OrdersTableToolbar({ initialSearch = "" }: OrdersTableToolbarProps) {
  const { status, period, setStatus, setPeriod } = useOrdersTableFilters();

  return (
    <TableToolbarContainer
      left={
        <>
          <OrdersSearchInput defaultValue={initialSearch} />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
      right={
        <Button size="sm" asChild>
          <Link href="/orders/new">
            <Plus className="w-4 h-4 mr-1.5" />
            Nova ordem de serviço
          </Link>
        </Button>
      }
    />
  );
}
