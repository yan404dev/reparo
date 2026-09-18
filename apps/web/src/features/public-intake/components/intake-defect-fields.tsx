import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PublicCustomerIntakeInput } from "@fluxos/contracts";
import { SectionDivider } from "@/components/ui";

interface IntakeDefectFieldsProps {
  form: UseFormReturn<PublicCustomerIntakeInput>;
}

export function IntakeDefectFields({ form }: IntakeDefectFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <SectionDivider label="Defeito Relatado" />

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          O que está acontecendo com o seu aparelho? <span className="text-rose-500 font-bold">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Ex: A tela trincou após uma queda e o touch não responde; conector com mau contato..."
          {...register("reportedDefect")}
          className="w-full rounded-md border border-input bg-white p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {errors.reportedDefect && (
          <p className="text-xs text-destructive mt-1">{errors.reportedDefect.message}</p>
        )}
      </div>
    </div>
  );
}
