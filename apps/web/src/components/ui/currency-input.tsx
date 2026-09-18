"use client";

import React, { useCallback } from "react";
import { formatCurrencyMask, parseCurrencyToNumber } from "@fluxos/contracts";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "R$ 0,00",
  className = "",
  disabled = false,
}: CurrencyInputProps) {
  const displayValue = typeof value === "number" && value > 0 ? formatCurrencyMask(value) : "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = parseCurrencyToNumber(e.target.value);
      onChange(numValue);
    },
    [onChange]
  );

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`h-9 text-sm tabular-nums ${className}`.trim()}
    />
  );
}
