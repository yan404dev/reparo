import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PublicCustomerIntakeInput } from "@fluxos/contracts";
import { Input, Button, SectionDivider } from "@/components/ui";

const COMMON_BRANDS = ["Apple", "Samsung", "Motorola", "Xiaomi", "Outra"];

interface IntakeDeviceFieldsProps {
  form: UseFormReturn<PublicCustomerIntakeInput>;
}

export function IntakeDeviceFields({ form }: IntakeDeviceFieldsProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const selectedBrand = watch("deviceBrand");

  return (
    <div className="space-y-4">
      <SectionDivider label="Aparelho do Cliente" />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Marca do Smartphone <span className="text-rose-500 font-bold">*</span>
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {COMMON_BRANDS.map((brand) => (
            <Button
              key={brand}
              type="button"
              variant={selectedBrand === brand ? "default" : "outline"}
              size="sm"
              className={`h-8 px-3 text-sm shadow-none ${
                selectedBrand === brand ? "" : "bg-white text-muted-foreground"
              }`}
              onClick={() => setValue("deviceBrand", brand)}
            >
              {brand}
            </Button>
          ))}
          <Input
            type="text"
            placeholder="Ou digite outra marca..."
            {...register("deviceBrand")}
            className="h-8 text-sm w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-1">
            Modelo do Aparelho <span className="text-rose-500 font-bold">*</span>
          </label>
          <Input
            type="text"
            placeholder="Ex: iPhone 13 Pro, Galaxy S22"
            {...register("deviceModel")}
            className="h-9 text-sm"
          />
          {errors.deviceModel && (
            <p className="text-xs text-destructive mt-1">{errors.deviceModel.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Cor do Aparelho <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
          </label>
          <Input
            type="text"
            placeholder="Ex: Azul Meia-Noite"
            {...register("deviceColor")}
            className="h-9 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
