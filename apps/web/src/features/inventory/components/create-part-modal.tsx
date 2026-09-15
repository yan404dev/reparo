"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PackagePlus, Calculator, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { CategoryDTO, CreatePartSchema, CreatePartInput } from "@fluxos/contracts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Button,
} from "@/components/ui";

interface CreatePartModalProps {
  categories: CategoryDTO[];
  onClose: () => void;
}

export function CreatePartModal({ categories, onClose }: CreatePartModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePartInput>({
    resolver: zodResolver(CreatePartSchema),
    defaultValues: {
      sku: "",
      barcode: "",
      name: "",
      brand: "",
      categoryId: categories[0]?.id || "",
      supplier: "",
      costPrice: 0,
      suggestedMarkupPercent: 50,
      sellingPrice: 0,
      initialStock: 1,
      minStockThreshold: 3,
    },
  });

  const costPrice = watch("costPrice");
  const markupPercent = watch("suggestedMarkupPercent");

  const updateMarkup = (percent: number) => {
    setValue("suggestedMarkupPercent", percent);
    if (costPrice > 0) {
      setValue("sellingPrice", Number((costPrice * (1 + percent / 100)).toFixed(2)));
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CreatePartInput) =>
      apiRequest("/inventory/parts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-parts"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });

  const onSubmit = (data: CreatePartInput) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <PackagePlus className="w-4 h-4 text-primary" />
            Cadastrar Nova Peça
          </DialogTitle>
          <DialogDescription className="text-xs">
            Cadastre um novo componente ou insumo com precificação dinâmica
          </DialogDescription>
        </DialogHeader>

        {createMutation.error && (
          <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
            {createMutation.error.message || "Erro ao cadastrar peça"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                SKU / Código Único *
              </label>
              <Input
                {...register("sku")}
                placeholder="Ex: TELA-IP13-OLED"
                className="h-8 text-xs uppercase"
              />
              {errors.sku && <p className="text-[11px] text-destructive mt-0.5">{errors.sku.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Código de Barras / EAN
              </label>
              <Input
                {...register("barcode")}
                placeholder="Opcional"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Nome do Componente *
              </label>
              <Input
                {...register("name")}
                placeholder="Ex: Display OLED iPhone 13"
                className="h-8 text-xs"
              />
              {errors.name && <p className="text-[11px] text-destructive mt-0.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Marca / Fabricante *
              </label>
              <Input
                {...register("brand")}
                placeholder="Ex: Apple, Samsung, Foxconn"
                className="h-8 text-xs"
              />
              {errors.brand && <p className="text-[11px] text-destructive mt-0.5">{errors.brand.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Categoria *
              </label>
              <select
                {...register("categoryId")}
                className="w-full h-8 bg-background border border-input rounded-md px-2 text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Fornecedor Principal
              </label>
              <Input
                {...register("supplier")}
                placeholder="Ex: Distribuidora Alpha"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Calculator className="w-3.5 h-3.5 text-primary" />
              <span>Precificação & Margem Sugerida</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  Preço Custo (R$) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("costPrice", {
                    valueAsNumber: true,
                    onChange: (e) => {
                      const cost = parseFloat(e.target.value) || 0;
                      if (cost > 0) {
                        setValue("sellingPrice", Number((cost * (1 + (markupPercent || 50) / 100)).toFixed(2)));
                      }
                    },
                  })}
                  placeholder="0.00"
                  className="h-8 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  Markup (% margem)
                </label>
                <div className="flex gap-1">
                  {[50, 100, 150].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => updateMarkup(pct)}
                      className={`flex-1 h-8 rounded border text-[10px] font-semibold transition-colors ${
                        markupPercent === pct
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-input hover:bg-muted"
                      }`}
                    >
                      +{pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  Preço Venda (R$) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("sellingPrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="h-8 text-xs font-bold text-foreground"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Saldo Físico Inicial
              </label>
              <Input
                type="number"
                min="0"
                {...register("initialStock", { valueAsNumber: true })}
                className="h-8 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Estoque Mínimo de Alerta
              </label>
              <Input
                type="number"
                min="1"
                {...register("minStockThreshold", { valueAsNumber: true })}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="text-xs gap-1.5"
            >
              {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{createMutation.isPending ? "Cadastrando..." : "Cadastrar Peça"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
