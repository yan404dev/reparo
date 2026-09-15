"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Calculator, Sparkles } from "lucide-react";
import { CreateServiceOrderInput, PartDTO } from "@fluxos/contracts";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui";
import { FormSectionDivider } from "./form-section-divider";

interface OrderNewQuoteSectionProps {
  form: UseFormReturn<CreateServiceOrderInput>;
  currentModel?: string;
}

export function OrderNewQuoteSection({ form, currentModel }: OrderNewQuoteSectionProps) {
  const { setValue, watch } = form;
  const quote = watch("initialQuote") || {};
  const partPrice = Number(quote.partPrice || 0);
  const laborPrice = Number(quote.laborPrice || 0);
  const totalPreview = Math.max(0, partPrice + laborPrice);

  const { data: compatibleParts = [] } = useQuery<PartDTO[]>({
    queryKey: ["compatible-parts-lookup", currentModel],
    queryFn: () =>
      currentModel
        ? apiRequest(`/inventory/parts/compatible?model=${encodeURIComponent(currentModel)}`)
        : apiRequest("/inventory/parts"),
    staleTime: 1000 * 60,
  });

  const handlePartSelect = (partId: string) => {
    const part = compatibleParts.find((p) => p.id === partId);
    if (part) {
      setValue("initialQuote.partId", part.id);
      setValue("initialQuote.partDescription", part.name);
      setValue("initialQuote.partPrice", Number(part.sellingPrice || 0));
    } else {
      setValue("initialQuote.partId", null);
      setValue("initialQuote.partDescription", "");
      setValue("initialQuote.partPrice", 0);
    }
  };

  return (
    <div className="space-y-4">
      <FormSectionDivider icon={Calculator} title="Orçamento & Peças Iniciais (Opcional)" />

      <p className="text-xs text-muted-foreground">
        Consulte o catálogo de peças compatíveis, ajuste o preço de venda da peça e defina sua mão de obra. O total é calculado automaticamente.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Peça no Estoque {currentModel ? `(Compatível com ${currentModel})` : ""}
          </label>
          <select
            value={quote.partId || ""}
            onChange={(e) => handlePartSelect(e.target.value)}
            className="w-full h-9 bg-white border border-input rounded-md px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Nenhuma peça selecionada...</option>
            {compatibleParts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.name} • {formatCurrency(part.sellingPrice)} ({part.stockPhysical - part.stockReserved} em estoque)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Preço Variável da Peça (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={quote.partPrice ?? ""}
            onChange={(e) => setValue("initialQuote.partPrice", e.target.value ? Number(e.target.value) : 0)}
            placeholder="Ex: 350.00"
            className="h-9 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Mão de Obra do Técnico (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={quote.laborPrice ?? ""}
            onChange={(e) => setValue("initialQuote.laborPrice", e.target.value ? Number(e.target.value) : 0)}
            placeholder="Ex: 120.00"
            className="h-9 text-sm"
          />
        </div>
      </div>

      {totalPreview > 0 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Peça: <strong>{formatCurrency(partPrice)}</strong> + Mão de Obra: <strong>{formatCurrency(laborPrice)}</strong>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-emerald-700 block">Total do Orçamento</span>
            <span className="text-base font-bold text-emerald-900">{formatCurrency(totalPreview)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
