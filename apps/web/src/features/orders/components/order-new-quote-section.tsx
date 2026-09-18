"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { CreateServiceOrderInput, PartDTO } from "@fluxos/contracts";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { SectionDivider, CurrencyInput } from "@/components/ui";

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
      <SectionDivider label="Orçamento & Peças Iniciais (Opcional)" />

      <p className="text-sm text-muted-foreground">
        Consulte o catálogo de peças compatíveis, ajuste o preço de venda da peça e defina sua mão de obra.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Peça no Estoque {currentModel ? `(Compatível)` : ""}
          </label>
          <select
            value={quote.partId || ""}
            onChange={(e) => handlePartSelect(e.target.value)}
            className="w-full h-9 bg-white border border-input rounded-md px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Nenhuma peça (Apenas Serviço)</option>
            {compatibleParts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — Disp: {p.stockAvailable} ({formatCurrency(p.sellingPrice)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Preço da Peça
          </label>
          <CurrencyInput
            value={partPrice}
            onChange={(val) => setValue("initialQuote.partPrice", val)}
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Mão de Obra
          </label>
          <CurrencyInput
            value={laborPrice}
            onChange={(val) => setValue("initialQuote.laborPrice", val)}
            placeholder="R$ 0,00"
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-border mt-2">
        <span className="text-sm text-muted-foreground">
          Total Previsto do Orçamento
        </span>
        <span className="text-base font-semibold text-foreground tabular-nums">
          {formatCurrency(totalPreview)}
        </span>
      </div>
    </div>
  );
}
