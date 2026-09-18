"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { UserProfile } from "../types";

export function useLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ordersData } = useQuery({
    queryKey: ["layout-orders-count"],
    queryFn: () => apiRequest("/orders"),
  });

  const { data: partsData } = useQuery({
    queryKey: ["layout-parts-count"],
    queryFn: () => apiRequest("/inventory/parts"),
  });

  const ordersList: any[] = Array.isArray(ordersData)
    ? ordersData
    : Array.isArray(ordersData?.data)
      ? ordersData.data
      : [];

  const partsList: any[] = Array.isArray(partsData)
    ? partsData
    : Array.isArray(partsData?.data)
      ? partsData.data
      : [];

  const activeOrdersCount = ordersList.filter(
    (o: any) => o.status !== "FINALIZADA" && o.status !== "CANCELADA"
  ).length;

  const lowStockCount = partsList.filter(
    (p: any) => p.stockAvailable <= p.minStockThreshold
  ).length;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fluxos_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fluxos_token");
      localStorage.removeItem("fluxos_user");
      router.push("/auth?mode=login");
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return {
    pathname,
    user,
    logout,
    isActive,
    searchQuery,
    setSearchQuery,
    activeOrdersCount,
    lowStockCount,
  };
}
