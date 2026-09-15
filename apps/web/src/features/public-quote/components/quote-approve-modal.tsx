import React from "react";
import { CheckCircle2, ThumbsUp, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from "@/components/ui";

interface QuoteApproveModalProps {
  open: boolean;
  onClose: () => void;
  grandTotal: number;
  customerName: string;
  signature: string;
  onSignatureChange: (val: string) => void;
  onConfirm: () => void;
  isPending: boolean;
  error: string | null;
}

export function QuoteApproveModal({
  open,
  onClose,
  grandTotal,
  customerName,
  signature,
  onSignatureChange,
  onConfirm,
  isPending,
  error,
}: QuoteApproveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            Confirmar Aprovação do Orçamento
          </DialogTitle>
          <DialogDescription className="text-xs">
            Ao aprovar, você autoriza o início imediato do reparo no valor de{" "}
            <strong>{formatCurrency(grandTotal)}</strong>.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Confirme seu Nome Completo (Assinatura Digital)
            </label>
            <Input
              type="text"
              value={signature}
              onChange={(e) => onSignatureChange(e.target.value)}
              placeholder={customerName || "Digite seu nome"}
              className="h-9 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 text-xs shadow-none"
            >
              Voltar
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={onConfirm}
              className="h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-none"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ThumbsUp className="w-3.5 h-3.5" />
              )}
              Confirmar e Autorizar Reparo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
