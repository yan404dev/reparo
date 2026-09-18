import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FormInputField } from "@/components/ui/form-input-field";

interface PartStockFieldsProps {
  initialStockRegister: UseFormRegisterReturn;
  minStockRegister: UseFormRegisterReturn;
  initialStockError?: string;
  minStockError?: string;
}

export function PartStockFields({
  initialStockRegister,
  minStockRegister,
  initialStockError,
  minStockError,
}: PartStockFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
      <FormInputField
        label="Saldo Físico Inicial"
        type="number"
        placeholder="0"
        registration={initialStockRegister}
        error={initialStockError}
      />
      <FormInputField
        label="Estoque Mínimo de Alerta"
        type="number"
        placeholder="1"
        registration={minStockRegister}
        error={minStockError}
      />
    </div>
  );
}
