import React from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";

interface QuoteStatusBannerProps {
  isApproved: boolean;
  isCancelled: boolean;
}

export function QuoteStatusBanner({ isApproved, isCancelled }: QuoteStatusBannerProps) {
  if (isApproved) {
    return (
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="font-semibold">Serviço autorizado com sucesso!</p>
          <p className="mt-0.5 text-emerald-700">
            Nosso laboratório técnico já foi notificado e o seu aparelho está na fila de execução. Você receberá atualizações quando estiver pronto para retirada.
          </p>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-800 text-xs flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <p className="font-semibold">Orçamento Recusado</p>
          <p className="mt-0.5 text-red-700">
            O orçamento não foi aprovado e nenhum procedimento foi iniciado. O aparelho está disponível para retirada na loja.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
