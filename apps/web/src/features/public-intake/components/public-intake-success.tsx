"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicIntakeSuccessProps {
  orderNumber?: number;
  customerName?: string;
  onNewRequest: () => void;
}

export function PublicIntakeSuccess({
  orderNumber,
  customerName,
  onNewRequest,
}: PublicIntakeSuccessProps) {
  return (
    <div className="text-center py-6 space-y-4">
      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1c2b33]">
          Solicitação Enviada com Sucesso!
        </h2>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
          {customerName ? `Obrigado, ${customerName}! ` : ""}
          Nossa equipe técnica já recebeu as informações do seu aparelho.
          {orderNumber && (
            <span className="block font-semibold text-primary mt-1">
              Protocolo / OS #{orderNumber}
            </span>
          )}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left max-w-md mx-auto space-y-2 text-xs text-neutral-600">
        <p className="font-semibold text-neutral-800">Próximos passos:</p>
        <p>1. Entraremos em contato pelo seu WhatsApp para confirmar os detalhes.</p>
        <p>2. Você receberá o link exclusivo de acompanhamento e aprovação do laudo técnico.</p>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onNewRequest}
          className="text-xs h-8 px-4"
        >
          Enviar Outra Solicitação
        </Button>
      </div>
    </div>
  );
}
