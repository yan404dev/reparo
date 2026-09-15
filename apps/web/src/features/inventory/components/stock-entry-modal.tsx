"use client";

import React from "react";
import { PartDTO } from "@fluxos/contracts";
import { useStockEntryForm } from "../hooks/use-stock-entry-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from "@/components/ui";

interface StockEntryModalProps {
  part: PartDTO;
  onClose: () => void;
}

export function StockEntryModal({ part, onClose }: StockEntryModalProps) {
  const { form, error, isSubmitting, onSubmit } = useStockEntryForm({
    part,
    onSuccess: onClose,
  });

  const { register, formState: { errors } } = form;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Entrada de Estoque</DialogTitle>
          <DialogDescription>
            {part.name} ({part.sku})
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Quantidade de Entrada *
            </label>
            <Input
              type="number"
              min="1"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <span className="text-xs text-destructive mt-1 block">{errors.quantity.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Motivo / Referência *
            </label>
            <Input
              type="text"
              {...register("reason")}
              placeholder="Ex: Compra de lote fornecedor oficial"
            />
            {errors.reason && (
              <span className="text-xs text-destructive mt-1 block">{errors.reason.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="shadow-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="shadow-none"
            >
              {isSubmitting ? "Gravando..." : "Confirmar Entrada"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
