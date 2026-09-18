import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { CreateServiceOrderInput } from "@fluxos/contracts";
import { Button, Input, SectionDivider } from "@/components/ui";

const COMMON_BRANDS = ["Apple", "Samsung", "Motorola", "Xiaomi", "Outra"];

interface OrderNewDeviceSectionProps {
  form: UseFormReturn<CreateServiceOrderInput>;
  existingCustomer: any | null;
  deviceMode: "NEW" | "EXISTING";
  setDeviceMode: (mode: "NEW" | "EXISTING") => void;
}

export function OrderNewDeviceSection({
  form,
  existingCustomer,
  deviceMode,
  setDeviceMode,
}: OrderNewDeviceSectionProps) {
  const { register, watch, setValue } = form;
  const selectedBrand = watch("deviceBrand");
  const selectedDeviceId = watch("deviceId");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <SectionDivider label="Aparelho do Cliente" />
        </div>
        {existingCustomer?.devices && existingCustomer.devices.length > 0 && (
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg shrink-0">
            <Button
              type="button"
              variant={deviceMode === "EXISTING" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 text-xs font-medium ${deviceMode === "EXISTING" ? "shadow-none" : "text-muted-foreground"}`}
              onClick={() => setDeviceMode("EXISTING")}
            >
              Cadastrado ({existingCustomer.devices.length})
            </Button>
            <Button
              type="button"
              variant={deviceMode === "NEW" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 text-xs font-medium ${deviceMode === "NEW" ? "shadow-none" : "text-muted-foreground"}`}
              onClick={() => setDeviceMode("NEW")}
            >
              + Novo
            </Button>
          </div>
        )}
      </div>

      {deviceMode === "EXISTING" && existingCustomer?.devices && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Selecione qual smartphone este cliente trouxe hoje:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {existingCustomer.devices.map((d: any) => {
              const isSelected = selectedDeviceId === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setValue("deviceId", d.id)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {d.brand} {d.model}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">IMEI: {d.imei}</p>
                  {d.color && <p className="text-xs text-muted-foreground">Cor: {d.color}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {deviceMode === "NEW" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Marca do Aparelho *
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {COMMON_BRANDS.map((brand) => (
                <Button
                  key={brand}
                  type="button"
                  variant={selectedBrand === brand ? "default" : "outline"}
                  size="sm"
                  className={`h-8 px-3 text-sm shadow-none ${selectedBrand === brand ? "" : "bg-white text-muted-foreground"}`}
                  onClick={() => setValue("deviceBrand", brand)}
                >
                  {brand}
                </Button>
              ))}
              <Input
                type="text"
                {...register("deviceBrand")}
                placeholder="Ou digite outra marca..."
                className="h-8 text-sm w-48"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">
                Modelo do Aparelho *
              </label>
              <Input
                type="text"
                {...register("deviceModel")}
                placeholder="Ex: iPhone 13 Pro ou Galaxy S22"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Cor do Aparelho
              </label>
              <Input
                type="text"
                {...register("deviceColor")}
                placeholder="Ex: Azul Meia-Noite"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Senha de Desbloqueio
              </label>
              <Input
                type="text"
                {...register("devicePasscode")}
                placeholder="Ex: 123456 ou Padrão em L"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              IMEI / Serial <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
            </label>
            <Input
              type="text"
              {...register("deviceImei")}
              placeholder="Ex: 357890123456789"
              className="h-9 font-mono text-sm max-w-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
