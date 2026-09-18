import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalFormFooterProps {
  onCancel: () => void;
  isPending?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
}

export function ModalFormFooter({
  onCancel,
  isPending = false,
  submitLabel = "Cadastrar Peça",
  loadingLabel = "Cadastrando...",
}: ModalFormFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
      <Button
        type="button"
        variant="outline"
        size="default"
        onClick={onCancel}
        className="text-sm font-medium h-9 px-4"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        size="default"
        disabled={isPending}
        className="text-sm font-medium h-9 px-4 gap-2"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>{isPending ? loadingLabel : submitLabel}</span>
      </Button>
    </div>
  );
}
