"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useCreateOrderForm } from "@/features/orders/hooks/use-create-order-form";
import { OrderChecklistForm } from "@/features/orders/components/order-checklist-form";
import { Card, CardContent, Button, Input } from "@/components/ui";

export default function NewOrderPage() {
  const {
    form,
    customers,
    devices,
    technicians,
    isSubmitting,
    submitError,
    onSubmit,
  } = useCreateOrderForm();

  const { register, watch, setValue, formState: { errors } } = form;
  const currentChecklist = watch("entryChecklist");

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-md shadow-none bg-white">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Nova Ordem de Serviço</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cadastro de entrada de smartphone com checklist de integridade
          </p>
        </div>
      </div>

      {submitError && (
        <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {submitError}
        </div>
      )}

      <Card className="shadow-none">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Cliente *
                </label>
                <select
                  {...register("customerId")}
                  className="w-full h-9 bg-white border border-input rounded-md px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Selecione o cliente...</option>
                  {customers.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <span className="text-xs text-destructive mt-1 block">{errors.customerId.message}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Técnico Responsável
                </label>
                <select
                  {...register("technicianId")}
                  className="w-full h-9 bg-white border border-input rounded-md px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Atribuir na bancada depois...</option>
                  {technicians.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative bg-white px-5">
                  <span className="text-base md:text-lg font-semibold tracking-tight text-foreground">
                    Aparelho & Defeito Relatado
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Aparelho do Cliente *
                  </label>
                  <select
                    {...register("deviceId")}
                    className="w-full h-9 bg-white border border-input rounded-md px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Selecione o aparelho cadastrado...</option>
                    {devices.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.model} • IMEI: {d.imei}
                      </option>
                    ))}
                  </select>
                  {errors.deviceId && (
                    <span className="text-xs text-destructive mt-1 block">{errors.deviceId.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Defeito Relatado *
                  </label>
                  <Input
                    type="text"
                    {...register("reportedDefect")}
                    placeholder="Ex: Não carrega ou touch falhando"
                    className="h-9"
                  />
                  {errors.reportedDefect && (
                    <span className="text-xs text-destructive mt-1 block">{errors.reportedDefect.message}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative bg-white px-5">
                  <span className="text-base md:text-lg font-semibold tracking-tight text-foreground">
                    Checklist de Entrada Obrigatório
                  </span>
                </div>
              </div>

              <OrderChecklistForm
                checklist={currentChecklist}
                onChange={(updated) => setValue("entryChecklist", updated)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Saúde da Bateria (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={currentChecklist.batteryHealth || ""}
                    onChange={(e) =>
                      setValue("entryChecklist.batteryHealth", e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder="Ex: 84"
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Condição da Carcaça
                  </label>
                  <select
                    value={currentChecklist.casingCondition}
                    onChange={(e) => setValue("entryChecklist.casingCondition", e.target.value as any)}
                    className="w-full h-9 bg-white border border-input rounded-md px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="EXCELENTE">Excelente</option>
                    <option value="BOM">Bom</option>
                    <option value="DESGASTADO">Desgastado</option>
                    <option value="DANIFICADO">Danificado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" size="sm" asChild className="shadow-none">
                <Link href="/orders">Cancelar</Link>
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="shadow-none">
                <Save className="w-3.5 h-3.5 mr-1" />
                <span>{isSubmitting ? "Criando OS..." : "Registrar Entrada"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
