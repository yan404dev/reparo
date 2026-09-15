"use client";

import { useReducer, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { CreateServiceOrderSchema, CreateServiceOrderInput } from "@fluxos/contracts";

type DeviceMode = "NEW" | "EXISTING";

interface CustomerLookupState {
  existingCustomer: any | null;
  isSearching: boolean;
  deviceMode: DeviceMode;
  submitError: string | null;
}

type CustomerLookupAction =
  | { type: "LOOKUP_START" }
  | { type: "LOOKUP_SUCCESS"; customer: any; hasDevices: boolean; initialDeviceId: string }
  | { type: "LOOKUP_CLEAR" }
  | { type: "SET_DEVICE_MODE"; mode: DeviceMode }
  | { type: "SET_SUBMIT_ERROR"; error: string | null };

const initialLookupState: CustomerLookupState = {
  existingCustomer: null,
  isSearching: false,
  deviceMode: "NEW",
  submitError: null,
};

function lookupReducer(state: CustomerLookupState, action: CustomerLookupAction): CustomerLookupState {
  switch (action.type) {
    case "LOOKUP_START":
      return { ...state, isSearching: true, existingCustomer: null };
    case "LOOKUP_SUCCESS":
      return {
        ...state,
        isSearching: false,
        existingCustomer: action.customer,
        deviceMode: action.hasDevices && !action.initialDeviceId ? "EXISTING" : state.deviceMode,
      };
    case "LOOKUP_CLEAR":
      return { ...state, isSearching: false, existingCustomer: null };
    case "SET_DEVICE_MODE":
      return { ...state, deviceMode: action.mode };
    case "SET_SUBMIT_ERROR":
      return { ...state, submitError: action.error };
    default:
      return state;
  }
}

const DEFAULT_CHECKLIST: CreateServiceOrderInput["entryChecklist"] = {
  screenBroken: false,
  touchWorks: true,
  batteryHealth: 90,
  faceIdWorking: true,
  camerasOk: true,
  audioOk: true,
  chargePortWorking: true,
  casingCondition: "BOM",
  photoUrls: [],
  cosmeticPhotos: [],
  observation: "",
};

function buildOrderPayload(data: CreateServiceOrderInput, deviceMode: DeviceMode): CreateServiceOrderInput {
  const isNew = deviceMode === "NEW";
  return {
    ...data,
    deviceId: isNew ? null : data.deviceId,
    deviceBrand: isNew ? data.deviceBrand : null,
    deviceModel: isNew ? data.deviceModel : null,
    deviceImei: isNew ? data.deviceImei : null,
    deviceColor: isNew ? data.deviceColor : null,
    devicePasscode: isNew ? data.devicePasscode : null,
  };
}

function validateOrderData(
  data: CreateServiceOrderInput,
  deviceMode: DeviceMode
): string | null {
  if (!data.customerId && (!data.customerName || !data.customerDocument)) {
    return "Informe o Nome e o CPF do cliente para abrir a OS.";
  }
  if (deviceMode === "NEW" && (!data.deviceBrand || !data.deviceModel)) {
    return "Informe a Marca e o Modelo do aparelho.";
  }
  if (deviceMode === "EXISTING" && !data.deviceId) {
    return "Selecione um aparelho existente ou escolha cadastrar novo.";
  }
  return null;
}

export function useCreateOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const initialCpf = searchParams.get("cpf") ?? "";
  const initialName = searchParams.get("name") ?? "";
  const initialPhone = searchParams.get("phone") ?? "";
  const initialDeviceId = searchParams.get("deviceId") ?? "";

  const [state, dispatch] = useReducer(lookupReducer, {
    ...initialLookupState,
    deviceMode: initialDeviceId ? "EXISTING" : "NEW",
  });

  const form = useForm<CreateServiceOrderInput>({
    resolver: zodResolver(CreateServiceOrderSchema),
    defaultValues: {
      customerId: "",
      deviceId: initialDeviceId,
      technicianId: null,
      reportedDefect: "",
      customerName: initialName,
      customerDocument: initialCpf,
      customerPhone: initialPhone,
      customerEmail: "",
      deviceBrand: "Apple",
      deviceModel: "",
      deviceImei: "",
      deviceColor: "",
      devicePasscode: "",
      entryChecklist: DEFAULT_CHECKLIST,
    },
  });

  const { setValue } = form;

  const lookupCustomerByCpf = useCallback(
    async (cpfToSearch: string) => {
      const clean = cpfToSearch.replace(/\D/g, "");
      if (clean.length !== 11) {
        dispatch({ type: "LOOKUP_CLEAR" });
        return;
      }

      dispatch({ type: "LOOKUP_START" });
      try {
        const found = await apiRequest(`/customers/by-document/${clean}`);
        if (found?.id) {
          dispatch({
            type: "LOOKUP_SUCCESS",
            customer: found,
            hasDevices: (found.devices?.length ?? 0) > 0,
            initialDeviceId,
          });
          setValue("customerId", found.id);
          if (found.name) setValue("customerName", found.name);
          if (found.phone) setValue("customerPhone", found.phone);
          if (found.email) setValue("customerEmail", found.email);
          if (found.devices?.length > 0 && !initialDeviceId) {
            setValue("deviceId", found.devices[0].id);
          }
        } else {
          dispatch({ type: "LOOKUP_CLEAR" });
          setValue("customerId", null);
        }
      } catch {
        dispatch({ type: "LOOKUP_CLEAR" });
        setValue("customerId", null);
      }
    },
    [setValue, initialDeviceId]
  );

  useEffect(() => {
    if (initialCpf) lookupCustomerByCpf(initialCpf);
  }, [initialCpf, lookupCustomerByCpf]);

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
      queryClient.invalidateQueries({ queryKey: ["customers-list"] });
      queryClient.invalidateQueries({ queryKey: ["layout-orders-count"] });
      router.push(`/orders/${newOrder.id}`);
    },
    onError: (err: Error) => {
      dispatch({ type: "SET_SUBMIT_ERROR", error: err.message });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    dispatch({ type: "SET_SUBMIT_ERROR", error: null });
    const validationError = validateOrderData(data, state.deviceMode);
    if (validationError) {
      dispatch({ type: "SET_SUBMIT_ERROR", error: validationError });
      return;
    }
    createOrderMutation.mutate(buildOrderPayload(data, state.deviceMode));
  });

  return {
    form,
    existingCustomer: state.existingCustomer,
    isSearchingCustomer: state.isSearching,
    deviceMode: state.deviceMode,
    setDeviceMode: (mode: DeviceMode) => dispatch({ type: "SET_DEVICE_MODE", mode }),
    lookupCustomerByCpf,
    technicians: users.filter((u: any) => u.role === "TECNICO" || u.role === "ADMIN"),
    isSubmitting: createOrderMutation.isPending,
    submitError: state.submitError,
    onSubmit,
  };
}
