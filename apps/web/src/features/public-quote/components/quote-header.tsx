import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";

interface QuoteHeaderProps {
  orderNumber: number;
  isPending: boolean;
  isApproved: boolean;
  isCancelled: boolean;
}

export function QuoteHeader({ orderNumber, isPending, isApproved, isCancelled }: QuoteHeaderProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">Reparô</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-primary">OS #{orderNumber}</span>
            </div>
            <p className="text-xs text-muted-foreground">Portal do Cliente • Aprovação Digital de Orçamento</p>
          </div>
        </div>

        <div className="shrink-0">
          {isPending && (
            <Badge variant="secondary" className="gap-1.5 bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3.5 h-3.5" />
              Aguardando sua Aprovação
            </Badge>
          )}
          {isApproved && (
            <Badge className="gap-1.5 bg-emerald-600 text-white border-none">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Orçamento Aprovado
            </Badge>
          )}
          {isCancelled && (
            <Badge variant="destructive" className="gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Orçamento Recusado
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
