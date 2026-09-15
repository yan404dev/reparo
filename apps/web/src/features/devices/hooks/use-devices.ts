"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { DeviceDTO } from "@fluxos/contracts";

export function useDevices() {
  const [search, setSearch] = useState("");

  const { data: devices = [], isLoading } = useQuery<DeviceDTO[]>({
    queryKey: ["devices-list", search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      return apiRequest(`/devices?${params.toString()}`);
    },
  });

  return {
    devices,
    isLoading,
    search,
    setSearch,
  };
}
