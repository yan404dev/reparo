"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { StockEntrySchema, StockEntryInput, PartDTO } from "@fluxos/contracts";

interface UseStockEntryFormProps {
  part: PartDTO;
  onSuccess: () => void;
}

export function useStockEntryForm({ part, onSuccess }: UseStockEntryFormProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StockEntryInput>({
    resolver: zodResolver(StockEntrySchema),
    defaultValues: {
      partId: part.id,
      quantity: 1,
      reason: "Entrada de lote fornecedor",
    },
  });

  const entryMutation = useMutation({
    mutationFn: (data: StockEntryInput) =>
      apiRequest("/inventory/movements/entry", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-parts"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
      queryClient.invalidateQueries({ queryKey: ["layout-parts-count"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-parts"] });
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setError(null);
    entryMutation.mutate(data);
  });

  return {
    form,
    error,
    isSubmitting: entryMutation.isPending,
    onSubmit,
  };
}
