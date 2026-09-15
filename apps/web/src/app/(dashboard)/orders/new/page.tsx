"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
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
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-md shadow-none bg-white shrink-0">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Nova Ordem de Serviço</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Preencha os dados do cliente e do aparelho. O histórico é unificado automaticamente pelo CPF.
          </p>
        </div>
      </div>

      {submitError && (
        <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <Card className="shadow-none">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-8">
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
              <Button variant="outline" size="sm" asChild className="shadow-none">
                <Link href="/orders">Cancelar</Link>
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="shadow-none font-semibold px-5">
                <Save className="w-3.5 h-3.5 mr-1.5" />
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
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">Carregando formulário de OS...</span>
        </div>
      }
    >
      <NewOrderFormContent />
    </Suspense>
  );
}
