"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { AddOrderItemSchema, AddOrderItemInput, OrderItemType, PartDTO } from "@fluxos/contracts";

interface UseAddItemFormProps {
  orderId: string;
  compatibleParts: PartDTO[];
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function useAddItemForm({ orderId, compatibleParts, onSuccess, onError }: UseAddItemFormProps) {
  const queryClient = useQueryClient();
  const [selectedPart, setSelectedPart] = useState<PartDTO | null>(null);
  const [showRuptureModal, setShowRuptureModal] = useState(false);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [suppliesCost, setSuppliesCost] = useState<number>(0);
  const [markupPercent, setMarkupPercent] = useState<number>(0);

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

  const recalculatePrice = (partCost: number, labor: number, supplies: number, markup: number) => {
    const baseSum = Number(partCost || 0) + Number(labor || 0) + Number(supplies || 0);
    const multiplier = 1 + Number(markup || 0) / 100;
    const finalPrice = Number((baseSum * multiplier).toFixed(2));
    if (finalPrice > 0) {
      form.setValue("unitPrice", finalPrice);
    }
  };

  const onPartChange = (partId: string) => {
    form.setValue("partId", partId || null);
    const found = compatibleParts.find((p) => p.id === partId);
    setSelectedPart(found || null);

    if (found) {
      form.setValue("description", found.name);
      form.setValue("unitPrice", Number(found.sellingPrice));
      form.setValue("unitCost", Number(found.costPrice));

      if (found.stockAvailable <= 0) {
        setShowRuptureModal(true);
      }
    }
  };

  const handleConfirmBackorder = () => {
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
    onError: (err: any) => {
      onError(err.message);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    addItemMutation.mutate(data);
  });

  return {
    form,
    itemType,
    selectedPart,
    showRuptureModal,
    setShowRuptureModal,
    handleConfirmBackorder,
    laborCost,
    setLaborCost,
    suppliesCost,
    setSuppliesCost,
    markupPercent,
    setMarkupPercent,
    recalculatePrice,
    onPartChange,
    isSubmitting: addItemMutation.isPending,
    onSubmit,
  };
}
