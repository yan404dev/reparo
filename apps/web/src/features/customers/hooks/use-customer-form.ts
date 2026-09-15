"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { CreateCustomerSchema, CreateCustomerInput } from "@fluxos/contracts";

interface UseCustomerFormProps {
  onSuccess: () => void;
}

export function useCustomerForm({ onSuccess }: UseCustomerFormProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateCustomerInput>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      document: null,
      email: null,
      notes: null,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCustomerInput) =>
      apiRequest("/customers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers-list"] });
      queryClient.invalidateQueries({ queryKey: ["customers-dropdown"] });
      form.reset();
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setError(null);
    createMutation.mutate(data);
  });

  return {
    form,
    error,
    isSubmitting: createMutation.isPending,
    onSubmit,
  };
}
