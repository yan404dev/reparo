"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { StockScrapSchema, StockScrapInput, PartDTO } from "@fluxos/contracts";

interface UseStockScrapFormProps {
  part: PartDTO;
  onSuccess: () => void;
}

export function useStockScrapForm({ part, onSuccess }: UseStockScrapFormProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StockScrapInput>({
    resolver: zodResolver(StockScrapSchema),
    defaultValues: {
      partId: part.id,
      quantity: 1,
      reason: "",
      serviceOrderId: null,
    },
  });

  const scrapMutation = useMutation({
    mutationFn: (data: StockScrapInput) =>
      apiRequest("/inventory/movements/scrap", {
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
    scrapMutation.mutate(data);
  });

  return {
    form,
    error,
    isSubmitting: scrapMutation.isPending,
    onSubmit,
  };
}
