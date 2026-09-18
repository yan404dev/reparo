"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import {
  PublicCustomerIntakeSchema,
  PublicCustomerIntakeInput,
} from "@fluxos/contracts";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui";
import { IntakeCustomerFields } from "./intake-customer-fields";
import { IntakeDeviceFields } from "./intake-device-fields";
import { IntakeDefectFields } from "./intake-defect-fields";
import { PublicIntakeSuccess } from "./public-intake-success";

export function PublicIntakeForm() {
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  const form = useForm<PublicCustomerIntakeInput>({
    resolver: zodResolver(PublicCustomerIntakeSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerDocument: "",
      customerEmail: "",
      deviceBrand: "Apple",
      deviceModel: "",
      deviceColor: "",
      reportedDefect: "",
    },
  });

  const intakeMutation = useMutation({
    mutationFn: (data: PublicCustomerIntakeInput) =>
      apiRequest("/orders/public/intake", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res) => {
      setCreatedOrder(res);
    },
  });

  if (createdOrder) {
    return (
      <PublicIntakeSuccess
        orderNumber={createdOrder.orderNumber}
        customerName={createdOrder.customer?.name}
        onNewRequest={() => {
          setCreatedOrder(null);
          form.reset();
        }}
      />
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((data) => intakeMutation.mutate(data))}
      className="space-y-6"
    >
      {intakeMutation.error && (
        <div className="p-3.5 bg-destructive/10 text-destructive text-sm font-medium rounded-lg border border-destructive/20">
          {intakeMutation.error.message || "Erro ao enviar solicitação"}
        </div>
      )}

      <IntakeCustomerFields form={form} />
      <IntakeDeviceFields form={form} />
      <IntakeDefectFields form={form} />

      <div className="flex items-center justify-end gap-3 pt-5 border-t border-border">
        <Button
          type="submit"
          size="default"
          disabled={intakeMutation.isPending}
          className="h-9 px-5 text-sm font-medium gap-2 shadow-none"
        >
          {intakeMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando dados...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar para a Assistência Técnica</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
