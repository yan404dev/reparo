"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareIntakeLinkButtonProps {
  className?: string;
}

export function ShareIntakeLinkButton({ className = "" }: ShareIntakeLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const getIntakeUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/orcamento-online`;
    }
    return "/orcamento-online";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getIntakeUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`h-9 px-3 text-sm font-medium gap-1.5 shadow-none bg-white text-neutral-700 hover:text-neutral-950 border-neutral-200 ${className}`.trim()}
      title="Copie o link para o cliente abrir o pedido pelo celular ou WhatsApp"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-600 font-semibold">Link Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 text-neutral-500" />
          <span>Copiar link do cliente</span>
        </>
      )}
    </Button>
  );
}
