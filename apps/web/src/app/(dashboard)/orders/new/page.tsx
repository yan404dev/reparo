"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Save, AlertCircle } from "lucide-react";
import { useCreateOrderForm } from "@/features/orders/hooks/use-create-order-form";
import { Card, CardContent, Button } from "@/components/ui";
import { OrderNewCustomerSection } from "@/features/orders/components/order-new-customer-section";
import { OrderNewDeviceSection } from "@/features/orders/components/order-new-device-section";
import { OrderNewDefectSection } from "@/features/orders/components/order-new-defect-section";
import { OrderNewChecklistSection } from "@/features/orders/components/order-new-checklist-section";
import { OrderNewQuoteSection } from "@/features/orders/components/order-new-quote-section";

function NewOrderFormContent() {
  const {
    form,
    existingCustomer,
    isSearchingCustomer,
    deviceMode,
    setDeviceMode,
    lookupCustomerByCpf,
    technicians,
    isSubmitting,
    submitError,
    onSubmit,
  } = useCreateOrderForm();

  const selectedDeviceId = form.watch("deviceId");
  const typedModel = form.watch("deviceModel");
  const existingDevice = existingCustomer?.devices?.find((d: any) => d.id === selectedDeviceId);
  const currentModel = deviceMode === "EXISTING" ? existingDevice?.model : typedModel;

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Nova Ordem de Serviço</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Preencha os dados do cliente e do aparelho. O histórico é unificado automaticamente pelo CPF.
        </p>
      </div>

      {submitError && (
        <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <Card className="shadow-none">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <OrderNewCustomerSection
              form={form}
              existingCustomer={existingCustomer}
              isSearchingCustomer={isSearchingCustomer}
              lookupCustomerByCpf={lookupCustomerByCpf}
            />

            <OrderNewDeviceSection
              form={form}
              existingCustomer={existingCustomer}
              deviceMode={deviceMode}
              setDeviceMode={setDeviceMode}
            />

            <OrderNewDefectSection
              form={form}
              technicians={technicians}
            />

            <OrderNewChecklistSection
              form={form}
            />

            <OrderNewQuoteSection
              form={form}
              currentModel={currentModel}
            />

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-border">
              <Button variant="outline" size="default" asChild className="h-9 px-4 text-sm">
                <Link href="/orders">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                size="default"
                disabled={isSubmitting}
                className="h-9 px-5 text-sm font-medium gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? "Criando OS..." : "Registrar Entrada e Gerar OS"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Carregando formulário...</div>}>
      <NewOrderFormContent />
    </Suspense>
  );
}
