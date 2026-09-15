import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ClipboardList } from "lucide-react";
import { CreateServiceOrderInput } from "@fluxos/contracts";
import { Input } from "@/components/ui";
import { OrderChecklistForm } from "./order-checklist-form";
import { FormSectionDivider } from "./form-section-divider";

interface OrderNewChecklistSectionProps {
  form: UseFormReturn<CreateServiceOrderInput>;
}

export function OrderNewChecklistSection({ form }: OrderNewChecklistSectionProps) {
  const { watch, setValue } = form;
  const currentChecklist = watch("entryChecklist");

  return (
    <div className="space-y-5">
      <FormSectionDivider icon={ClipboardList} title="Checklist de Integridade na Entrada" />

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
  );
}
