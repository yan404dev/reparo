"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { AddOrderItemSchema, AddOrderItemInput, OrderItemType, PartDTO } from "@fluxos/contracts";

interface PricingState {
  laborCost: number;
  suppliesCost: number;
  markupPercent: number;
}

interface UseAddItemFormProps {
  orderId: string;
  compatibleParts: PartDTO[];
  onSuccess: () => void;
  onError: (msg: string) => void;
}

function computePrice(partCost: number, pricing: PricingState): number {
  const base = partCost + pricing.laborCost + pricing.suppliesCost;
  return Number((base * (1 + pricing.markupPercent / 100)).toFixed(2));
}

export function useAddItemForm({ orderId, compatibleParts, onSuccess, onError }: UseAddItemFormProps) {
  const queryClient = useQueryClient();
  const [selectedPart, setSelectedPart] = useState<PartDTO | null>(null);
  const [showRuptureModal, setShowRuptureModal] = useState(false);
  const [pricing, setPricing] = useState<PricingState>({
    laborCost: 0,
    suppliesCost: 0,
    markupPercent: 0,
  });

  const form = useForm<AddOrderItemInput>({
    resolver: zodResolver(AddOrderItemSchema),
    defaultValues: {
      type: OrderItemType.PECA,
      partId: null,
      description: "",
      quantity: 1,
      unitCost: 0,
      unitPrice: 0,
      discount: 0,
      warrantyDays: 90,
    },
  });

  const itemType = form.watch("type");

  const recalculatePrice = (partCost: number, updates: Partial<PricingState> = {}) => {
    const next = { ...pricing, ...updates };
    setPricing(next);
    const price = computePrice(partCost, next);
    if (price > 0) form.setValue("unitPrice", price);
  };

  const onPartChange = (partId: string) => {
    form.setValue("partId", partId || null);
    const found = compatibleParts.find((p) => p.id === partId) ?? null;
    setSelectedPart(found);

    if (found) {
      form.setValue("description", found.name);
      form.setValue("unitPrice", Number(found.sellingPrice));
      form.setValue("unitCost", Number(found.costPrice));
      if (found.stockAvailable <= 0) setShowRuptureModal(true);
    }
  };

  const confirmBackorder = () => {
    if (selectedPart) {
      form.setValue("description", `${selectedPart.name} [Sob Encomenda]`);
    }
    setShowRuptureModal(false);
  };

  const addItemMutation = useMutation({
    mutationFn: (data: AddOrderItemInput) =>
      apiRequest(`/orders/${orderId}/items`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders-list"] });
      form.reset();
      onSuccess();
    },
    onError: (err: Error) => onError(err.message),
  });

  return {
    form,
    itemType,
    selectedPart,
    showRuptureModal,
    setShowRuptureModal,
    confirmBackorder,
    pricing,
    recalculatePrice,
    onPartChange,
    isSubmitting: addItemMutation.isPending,
    onSubmit: form.handleSubmit((data) => addItemMutation.mutate(data)),
  };
}
