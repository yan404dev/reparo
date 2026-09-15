"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { CustomerDTO } from "@fluxos/contracts";

export function useCustomers() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: customers = [], isLoading } = useQuery<CustomerDTO[]>({
    queryKey: ["customers-list", search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      return apiRequest(`/customers?${params.toString()}`);
    },
  });

  return {
    customers,
    isLoading,
    search,
    setSearch,
    showModal,
    setShowModal,
  };
}
