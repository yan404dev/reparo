"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { useAddItemForm } from "../hooks/use-add-item-form";
import { PartDTO } from "@fluxos/contracts";
import { AlertTriangle, Calculator, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from "@/components/ui";

interface AddItemModalProps {
  orderId: string;
  compatibleParts: PartDTO[];
  onClose: () => void;
  onError: (msg: string) => void;
}

export function AddItemModal({ orderId, compatibleParts, onClose, onError }: AddItemModalProps) {
  const {
    form,
    itemType,
    selectedPart,
    showRuptureModal,
    setShowRuptureModal,
    confirmBackorder,
    pricing,
    recalculatePrice,
    onPartChange,
    isSubmitting,
    onSubmit,
  } = useAddItemForm({
    orderId,
    compatibleParts,
    onSuccess: onClose,
    onError,
  });

  const { laborCost, suppliesCost, markupPercent } = pricing;

  const { register, setValue, formState: { errors } } = form;

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Item ao Orçamento</DialogTitle>
            <DialogDescription>
              Selecione peças de reposição ou adicione mão de obra técnica
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={itemType === "PECA" ? "default" : "outline"}
              size="sm"
              onClick={() => setValue("type", "PECA" as any)}
              className="flex-1 shadow-none"
            >
              Peça de Reposição
            </Button>
            <Button
              type="button"
              variant={itemType === "SERVICO_MAO_DE_OBRA" ? "default" : "outline"}
              size="sm"
              onClick={() => setValue("type", "SERVICO_MAO_DE_OBRA" as any)}
              className="flex-1 shadow-none"
            >
              Mão de Obra
            </Button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3.5">
            {itemType === "PECA" ? (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Peça Compatível
                </label>
                <select
                  onChange={(e) => onPartChange(e.target.value)}
                  className="w-full h-9 bg-white border border-input rounded-md px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Selecione do catálogo...</option>
                  {compatibleParts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} • Disp: {p.stockAvailable} un. • {formatCurrency(p.sellingPrice)}
                    </option>
                  ))}
                </select>

                {selectedPart && (
                  <div className="mt-2 text-[11px] flex items-center justify-between text-muted-foreground bg-muted/30 p-2 rounded">
                    <span>Saldo físico: {selectedPart.stockPhysical}</span>
                    <span>Reservado: {selectedPart.stockReserved}</span>
                    <span className={selectedPart.stockAvailable <= 0 ? "font-semibold text-destructive" : "font-semibold text-emerald-600"}>
                      Disponível: {selectedPart.stockAvailable}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Descrição do Serviço Técnico
                </label>
                <Input
                  type="text"
                  {...register("description")}
                  placeholder="Ex: Troca de conector e desoxidação química"
                  className="h-9 text-xs"
                />
                {errors.description && (
                  <span className="text-xs text-destructive mt-1 block">{errors.description.message}</span>
                )}
              </div>
            )}

            <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Calculator className="w-3.5 h-3.5 text-primary" />
                Precificação Inteligente & Margem
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-0.5">
                    Mão de Obra (R$)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={laborCost}
                    onChange={(e) =>
                      recalculatePrice(Number(selectedPart?.costPrice ?? 0), {
                        laborCost: Number(e.target.value),
                      })
                    }
                    className="h-8 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-muted-foreground mb-0.5">
                    Insumos (R$)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={suppliesCost}
                    onChange={(e) =>
                      recalculatePrice(Number(selectedPart?.costPrice ?? 0), {
                        suppliesCost: Number(e.target.value),
                      })
                    }
                    className="h-8 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-muted-foreground mb-0.5">
                    Markup (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="5"
                    value={markupPercent}
                    onChange={(e) =>
                      recalculatePrice(Number(selectedPart?.costPrice ?? 0), {
                        markupPercent: Number(e.target.value),
                      })
                    }
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Quantidade
                </label>
                <Input
                  type="number"
                  min="1"
                  {...register("quantity", { valueAsNumber: true })}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Preço Final Unitário (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("unitPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="h-9 text-xs font-semibold text-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="shadow-none text-xs h-9"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="shadow-none text-xs h-9 font-semibold"
              >
                {isSubmitting ? "Gravando..." : "Confirmar Inclusão"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {showRuptureModal && (
        <Dialog open={true} onOpenChange={() => setShowRuptureModal(false)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive text-sm font-semibold">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                Ruptura de Estoque Detectada
              </DialogTitle>
              <DialogDescription className="text-xs text-foreground mt-2 leading-relaxed">
                Peça <strong>{selectedPart?.name}</strong> sem saldo disponível em estoque. Deseja incluir no orçamento sob encomenda?
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="button"
                onClick={confirmBackorder}
                className="h-9 text-xs font-semibold gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Sim, Incluir sob Encomenda
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowRuptureModal(false);
                  setValue("partId", null);
                }}
                className="h-9 text-xs"
              >
                Escolher Outra Peça
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
