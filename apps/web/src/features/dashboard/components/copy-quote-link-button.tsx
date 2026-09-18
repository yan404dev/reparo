"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyQuoteLinkButtonProps {
  publicToken?: string;
  orderNumber?: number;
  className?: string;
}

export function CopyQuoteLinkButton({
  publicToken,
  orderNumber,
  className = "",
}: CopyQuoteLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  if (!publicToken) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/orcamento/${publicToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencioso
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      title={orderNumber ? `Copiar link do orçamento da OS #${orderNumber}` : "Copiar link do orçamento"}
      className={`h-7 px-2 text-xs font-medium gap-1 text-neutral-600 hover:text-neutral-900 border-neutral-200 bg-white shadow-none ${className}`.trim()}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600 font-semibold">Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-neutral-500" />
          <span>Orçamento Online</span>
        </>
      )}
    </Button>
  );
}
