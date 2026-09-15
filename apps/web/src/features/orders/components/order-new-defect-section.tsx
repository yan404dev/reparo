import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Wrench } from "lucide-react";
import { CreateServiceOrderInput } from "@fluxos/contracts";
import { Input } from "@/components/ui";
import { FormSectionDivider } from "./form-section-divider";

interface OrderNewDefectSectionProps {
  form: UseFormReturn<CreateServiceOrderInput>;
  technicians: any[];
}

export function OrderNewDefectSection({ form, technicians }: OrderNewDefectSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <FormSectionDivider icon={Wrench} title="Defeito Relatado & Responsável" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Defeito Relatado pelo Cliente *
          </label>
          <Input
            type="text"
            {...register("reportedDefect")}
            placeholder="Ex: Aparelho molhou e não liga mais, tela sem imagem"
            className="h-9 text-sm"
          />
          {errors.reportedDefect && (
            <span className="text-xs text-destructive mt-1 block">{errors.reportedDefect.message}</span>
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
    </div>
  );
}
