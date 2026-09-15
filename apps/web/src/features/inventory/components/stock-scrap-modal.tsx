"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { PartDTO } from "@fluxos/contracts";
import { useStockScrapForm } from "../hooks/use-stock-scrap-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from "@/components/ui";

interface StockScrapModalProps {
  part: PartDTO;
  onClose: () => void;
}

export function StockScrapModal({ part, onClose }: StockScrapModalProps) {
  const { form, error, isSubmitting, onSubmit } = useStockScrapForm({
    part,
    onSuccess: onClose,
  });

  const { register, formState: { errors } } = form;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <span>Baixa por Avaria Técnica / Sucata</span>
          </DialogTitle>
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
              Quantidade Danificada *
            </label>
            <Input
              type="number"
              min="1"
              max={part.stockAvailable}
              {...register("quantity", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground mt-1">Disponível para descarte: {part.stockAvailable} un.</p>
            {errors.quantity && (
              <span className="text-xs text-destructive mt-1 block">{errors.quantity.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Justificativa Técnica do Descarte *
            </label>
            <textarea
              rows={3}
              {...register("reason")}
              placeholder="Ex: Flex rompido durante o processo de montagem na bancada"
              className="w-full bg-white border border-input rounded-md p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
              variant="destructive"
              disabled={isSubmitting}
              className="shadow-none"
            >
              {isSubmitting ? "Descartando..." : "Confirmar Baixa Definitiva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
