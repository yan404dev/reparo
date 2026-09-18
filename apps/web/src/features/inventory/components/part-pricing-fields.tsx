import React from "react";
import { CurrencyInput } from "@/components/ui/currency-input";

interface PartPricingFieldsProps {
  costPrice?: number;
  sellingPrice?: number;
  onCostChange: (value: number) => void;
  onSellingChange: (value: number) => void;
  markupPercent?: number;
  onMarkupChange: (percent: number) => void;
  costError?: string;
  sellingError?: string;
}

export function PartPricingFields({
  costPrice,
  sellingPrice,
  onCostChange,
  onSellingChange,
  markupPercent,
  onMarkupChange,
  costError,
  sellingError,
}: PartPricingFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Preço Custo (R$) *
        </label>
        <CurrencyInput
          value={costPrice}
          onChange={onCostChange}
          placeholder="R$ 0,00"
          className="font-medium"
        />
        {costError && <p className="text-xs text-destructive mt-1">{costError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Markup (% margem)
        </label>
        <div className="flex gap-1.5">
          {[50, 100, 150].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => onMarkupChange(pct)}
              className={`flex-1 h-9 rounded-md border text-xs font-semibold transition-colors ${
                markupPercent === pct
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-muted-foreground border-input hover:bg-neutral-50"
              }`}
            >
              +{pct}%
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Preço Venda (R$) *
        </label>
        <CurrencyInput
          value={sellingPrice}
          onChange={onSellingChange}
          placeholder="R$ 0,00"
          className="font-bold text-foreground"
        />
        {sellingError && <p className="text-xs text-destructive mt-1">{sellingError}</p>}
      </div>
    </div>
  );
}
