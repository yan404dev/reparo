"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { ServiceOrderDTO } from "@fluxos/contracts";

export function useOrdersList() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const { data: orders = [], isLoading } = useQuery<ServiceOrderDTO[]>({
    queryKey: ["orders-list", statusFilter, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (search) params.append("search", search);
      return apiRequest(`/orders?${params.toString()}`);
    },
  });

  const statusTabs = [
    { id: "ALL", label: "Todas" },
    { id: "CRIADA", label: "Criadas" },
    { id: "AGUARDANDO_APROVACAO", label: "Aguardando Aprovação" },
    { id: "APROVADA", label: "Aprovadas" },
    { id: "EM_REPARO", label: "Em Bancada" },
    { id: "TESTES_FINAIS", label: "Testes" },
    { id: "PRONTO_RETIRADA", label: "Pronto" },
    { id: "FINALIZADA", label: "Finalizadas" },
  ];

  return {
    orders,
    isLoading,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    statusTabs,
  };
}
