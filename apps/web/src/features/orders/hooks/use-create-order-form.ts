"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { CreateServiceOrderSchema, CreateServiceOrderInput } from "@fluxos/contracts";

export function useCreateOrderForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateServiceOrderInput>({
    resolver: zodResolver(CreateServiceOrderSchema),
    defaultValues: {
      customerId: "",
      deviceId: "",
      technicianId: null,
      reportedDefect: "",
      entryChecklist: {
        screenBroken: false,
        touchWorks: true,
        batteryHealth: 90,
        faceIdWorking: true,
        camerasOk: true,
        audioOk: true,
        chargePortWorking: true,
        casingCondition: "BOM",
        photoUrls: [],
        observation: "",
      },
    },
  });

  const selectedCustomerId = form.watch("customerId");

  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["customers-dropdown"],
    queryFn: () => apiRequest("/customers"),
  });

  const { data: devices = [], isLoading: loadingDevices } = useQuery({
    queryKey: ["devices-dropdown", selectedCustomerId],
    queryFn: () =>
      selectedCustomerId
        ? apiRequest(`/devices?search=${selectedCustomerId}`)
        : apiRequest("/devices"),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["technicians-dropdown"],
    queryFn: () => apiRequest("/users"),
  });

  const createOrderMutation = useMutation({
    mutationFn: (payload: CreateServiceOrderInput) =>
      apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ["orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-orders"] });
      queryClient.invalidateQueries({ queryKey: ["layout-orders-count"] });
      router.push(`/orders/${newOrder.id}`);
    },
    onError: (err: any) => {
      setSubmitError(err.message);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setSubmitError(null);
    createOrderMutation.mutate(data);
  });

  return {
    form,
    customers,
    devices,
    technicians: users.filter((u: any) => u.role === "TECNICO" || u.role === "ADMIN"),
    loadingCustomers,
    loadingDevices,
    isSubmitting: createOrderMutation.isPending,
    submitError,
    onSubmit,
  };
}
