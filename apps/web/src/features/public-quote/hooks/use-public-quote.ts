"use client";

import { useReducer } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

type ModalKind = "approve" | "reject" | null;

interface QuoteFormState {
  activeModal: ModalKind;
  customerSignature: string;
  rejectionReason: string;
  approveError: string | null;
  rejectError: string | null;
}

type QuoteFormAction =
  | { type: "OPEN_MODAL"; modal: ModalKind }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_SIGNATURE"; value: string }
  | { type: "SET_REJECTION_REASON"; value: string }
  | { type: "SET_APPROVE_ERROR"; error: string | null }
  | { type: "SET_REJECT_ERROR"; error: string | null };

const initialFormState: QuoteFormState = {
  activeModal: null,
  customerSignature: "",
  rejectionReason: "",
  approveError: null,
  rejectError: null,
};

function formReducer(state: QuoteFormState, action: QuoteFormAction): QuoteFormState {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, activeModal: action.modal, approveError: null, rejectError: null };
    case "CLOSE_MODAL":
      return { ...state, activeModal: null };
    case "SET_SIGNATURE":
      return { ...state, customerSignature: action.value };
    case "SET_REJECTION_REASON":
      return { ...state, rejectionReason: action.value };
    case "SET_APPROVE_ERROR":
      return { ...state, approveError: action.error };
    case "SET_REJECT_ERROR":
      return { ...state, rejectError: action.error };
    default:
      return state;
  }
}

const APPROVED_STATUSES = ["APROVADA", "EM_REPARO", "TESTES_FINAIS", "PRONTO_RETIRADA", "FINALIZADA"];

export function usePublicQuote(publicToken: string) {
  const queryClient = useQueryClient();
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["public-order", publicToken],
    queryFn: () => apiRequest(`/orders/public/${publicToken}`),
    retry: 1,
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/orders/public/${publicToken}/approve`, {
        method: "POST",
        body: JSON.stringify({
          customerSignature: formState.customerSignature.trim() || undefined,
        }),
      }),
    onSuccess: () => {
      dispatch({ type: "CLOSE_MODAL" });
      queryClient.invalidateQueries({ queryKey: ["public-order", publicToken] });
    },
    onError: (err: Error) => {
      dispatch({ type: "SET_APPROVE_ERROR", error: err.message || "Erro ao aprovar orçamento" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/orders/public/${publicToken}/reject`, {
        method: "POST",
        body: JSON.stringify({
          rejectionReason: formState.rejectionReason.trim() || undefined,
        }),
      }),
    onSuccess: () => {
      dispatch({ type: "CLOSE_MODAL" });
      queryClient.invalidateQueries({ queryKey: ["public-order", publicToken] });
    },
    onError: (err: Error) => {
      dispatch({ type: "SET_REJECT_ERROR", error: err.message || "Erro ao recusar orçamento" });
    },
  });

  const isPending =
    order?.status === "AGUARDANDO_APROVACAO" || order?.status === "CRIADA";
  const isApproved = APPROVED_STATUSES.includes(order?.status ?? "");
  const isCancelled = order?.status === "CANCELADA";

  return {
    order,
    isLoading,
    error,
    isPending,
    isApproved,
    isCancelled,

    showApproveModal: formState.activeModal === "approve",
    showRejectModal: formState.activeModal === "reject",
    openApproveModal: () => dispatch({ type: "OPEN_MODAL", modal: "approve" }),
    openRejectModal: () => dispatch({ type: "OPEN_MODAL", modal: "reject" }),
    closeModal: () => dispatch({ type: "CLOSE_MODAL" }),

    customerSignature: formState.customerSignature,
    setCustomerSignature: (value: string) => dispatch({ type: "SET_SIGNATURE", value }),

    rejectionReason: formState.rejectionReason,
    setRejectionReason: (value: string) => dispatch({ type: "SET_REJECTION_REASON", value }),

    approveError: formState.approveError,
    rejectError: formState.rejectError,

    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    approve: () => approveMutation.mutate(),
    reject: () => rejectMutation.mutate(),
  };
}
