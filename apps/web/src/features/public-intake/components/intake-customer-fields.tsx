import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PublicCustomerIntakeInput, formatCpfMask, formatPhoneMask } from "@fluxos/contracts";
import { Input } from "@/components/ui";

interface IntakeCustomerFieldsProps {
  form: UseFormReturn<PublicCustomerIntakeInput>;
}

export function IntakeCustomerFields({ form }: IntakeCustomerFieldsProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const customerPhone = watch("customerPhone") || "";
  const customerDocument = watch("customerDocument") || "";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Nome Completo <span className="text-rose-500 font-bold">*</span>
          </label>
          <Input
            type="text"
            placeholder="Ex: Carlos Silva"
            {...register("customerName")}
            className="h-9 text-sm"
          />
          {errors.customerName && (
            <p className="text-xs text-destructive mt-1">{errors.customerName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            WhatsApp / Celular <span className="text-rose-500 font-bold">*</span>
          </label>
          <Input
            type="text"
            placeholder="(00) 00000-0000"
            value={customerPhone}
            onChange={(e) => setValue("customerPhone", formatPhoneMask(e.target.value))}
            className="h-9 text-sm"
          />
          {errors.customerPhone && (
            <p className="text-xs text-destructive mt-1">{errors.customerPhone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            CPF <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
          </label>
          <Input
            type="text"
            placeholder="000.000.000-00"
            value={customerDocument}
            onChange={(e) => setValue("customerDocument", formatCpfMask(e.target.value))}
            className="h-9 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}
