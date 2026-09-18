"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { OrderStatus, ServiceOrderDTO, PartDTO } from "@fluxos/contracts";

export function useOrderDetail(id: string) {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const { data: order, isLoading } = useQuery<ServiceOrderDTO>({
    queryKey: ["order-detail", id],
    queryFn: () => apiRequest(`/orders/${id}`),
    enabled: !!id,
  });

  const { data: compatibleParts = [] } = useQuery<PartDTO[]>({
    queryKey: ["compatible-parts", order?.device?.model],
    queryFn: async () => {
      if (order?.device?.model) {
        return apiRequest(`/inventory/parts/compatible?model=${encodeURIComponent(order.device.model)}`);
      }
      const res = await apiRequest("/inventory/parts?limit=50");
      return Array.isArray(res) ? res : res?.data || [];
    },
    enabled: !!order?.device?.model,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: OrderStatus) =>
      apiRequest(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      }),
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-parts"] });
    },
    onError: (err: Error) => setActionError(err.message),
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) =>
      apiRequest(`/orders/${id}/items/${itemId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["orders-list"] });
    },
    onError: (err: Error) => setActionError(err.message),
  });

  return {
    order,
    isLoading,
    compatibleParts,
    actionError,
    clearActionError: () => setActionError(null),
    showError: (msg: string) => setActionError(msg),
    showItemModal,
    setShowItemModal,
    isUpdatingStatus: updateStatusMutation.isPending,
    updateStatus: (status: OrderStatus) => updateStatusMutation.mutate(status),
    removeItem: (itemId: string) => removeItemMutation.mutate(itemId),
  };
}
