import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckCircle2, RefreshCw, Search } from "lucide-react";
import { CreateServiceOrderInput, formatCpfMask, formatPhoneMask } from "@fluxos/contracts";
import { Input, Badge } from "@/components/ui";

interface OrderNewCustomerSectionProps {
  form: UseFormReturn<CreateServiceOrderInput>;
  existingCustomer: any | null;
  isSearchingCustomer: boolean;
  lookupCustomerByCpf: (cpf: string) => Promise<void>;
}

export function OrderNewCustomerSection({
  form,
  existingCustomer,
  isSearchingCustomer,
  lookupCustomerByCpf,
}: OrderNewCustomerSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const customerDocument = watch("customerDocument") || "";
  const customerPhone = watch("customerPhone") || "";

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCpfMask(e.target.value);
    setValue("customerDocument", masked);
    const clean = masked.replace(/\D/g, "");
    if (clean.length === 11) {
      lookupCustomerByCpf(clean);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatPhoneMask(e.target.value);
    setValue("customerPhone", masked);
  };

  return (
    <div className="space-y-4">
      {existingCustomer && (
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Cliente Identificado:</strong> {existingCustomer.name} ({existingCustomer.phone}) —{" "}
              {existingCustomer.orders?.length || 0} OS(s) anteriores já vinculadas a este CPF!
            </span>
          </div>
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">
            Histórico Unificado
          </Badge>
        </div>
      )}

      {isSearchingCustomer && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Buscando cadastro por CPF...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            CPF do Cliente <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="000.000.000-00"
              value={customerDocument}
              onChange={handleCpfChange}
              onBlur={() => lookupCustomerByCpf(customerDocument)}
              className="h-9 font-mono text-sm"
              maxLength={14}
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">
            Digite o CPF para autocompletar e unificar
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Nome Completo <span className="text-rose-500 font-bold">*</span>
          </label>
          <Input
            type="text"
            {...register("customerName")}
            placeholder="Ex: Carlos Silva"
            className="h-9 text-sm"
          />
          {errors.customerName && (
            <span className="text-xs text-destructive mt-1 block">{errors.customerName.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            WhatsApp / Telefone <span className="text-rose-500 font-bold">*</span>
          </label>
          <Input
            type="text"
            placeholder="(00) 00000-0000"
            value={customerPhone}
            onChange={handlePhoneChange}
            className="h-9 text-sm"
            maxLength={15}
          />
          {errors.customerPhone && (
            <span className="text-xs text-destructive mt-1 block">{errors.customerPhone.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
