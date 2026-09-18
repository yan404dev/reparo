import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { CategoryDTO } from "@fluxos/contracts";
import { FormInputField } from "@/components/ui/form-input-field";
import { PartCategorySelect } from "./part-category-select";

interface PartBasicFieldsProps {
  skuRegister: UseFormRegisterReturn;
  barcodeRegister: UseFormRegisterReturn;
  nameRegister: UseFormRegisterReturn;
  brandRegister: UseFormRegisterReturn;
  supplierRegister: UseFormRegisterReturn;
  categoryId?: string | null;
  categories: CategoryDTO[];
  onCategoryChange: (id: string) => void;
  errors: Record<string, { message?: string } | undefined>;
}

export function PartBasicFields({
  skuRegister,
  barcodeRegister,
  nameRegister,
  brandRegister,
  supplierRegister,
  categoryId,
  categories,
  onCategoryChange,
  errors,
}: PartBasicFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormInputField
          label="SKU / Código Único *"
          placeholder="Ex: TELA-IP13-OLED"
          registration={skuRegister}
          error={errors.sku?.message}
          uppercase
        />
        <FormInputField
          label="Código de Barras / EAN"
          placeholder="Opcional"
          registration={barcodeRegister}
          error={errors.barcode?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormInputField
          label="Nome do Componente *"
          placeholder="Ex: Display OLED iPhone 13"
          registration={nameRegister}
          error={errors.name?.message}
        />
        <FormInputField
          label="Marca / Fabricante *"
          placeholder="Ex: Apple, Samsung, Foxconn"
          registration={brandRegister}
          error={errors.brand?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Categoria *
          </label>
          <PartCategorySelect
            categories={categories}
            value={categoryId}
            onChange={onCategoryChange}
          />
          {errors.categoryId && (
            <p className="text-xs text-destructive mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>
        <FormInputField
          label="Fornecedor Principal"
          placeholder="Ex: Distribuidora Alpha"
          registration={supplierRegister}
          error={errors.supplier?.message}
        />
      </div>
    </div>
  );
}
