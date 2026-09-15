import React from "react";
import { XCircle, ThumbsDown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from "@/components/ui";

interface QuoteRejectModalProps {
  open: boolean;
  onClose: () => void;
  reason: string;
  onReasonChange: (val: string) => void;
  onConfirm: () => void;
  isPending: boolean;
  error: string | null;
}

export function QuoteRejectModal({
  open,
  onClose,
  reason,
  onReasonChange,
  onConfirm,
  isPending,
  error,
}: QuoteRejectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2 text-destructive">
            <XCircle className="w-4 h-4" />
            Recusar Orçamento
          </DialogTitle>
          <DialogDescription className="text-xs">
            Informe o motivo pelo qual você optou por não realizar o conserto (opcional).
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
              Motivo da Recusa (Opcional)
            </label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Ex: Valor acima do esperado, prefiro comprar outro..."
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
              variant="destructive"
              className="h-9 text-xs font-semibold gap-1 shadow-none"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ThumbsDown className="w-3.5 h-3.5" />
              )}
              Confirmar Recusa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
