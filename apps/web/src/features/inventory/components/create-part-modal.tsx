"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PackagePlus, Calculator, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { CategoryDTO } from "@fluxos/contracts";
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

  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [supplier, setSupplier] = useState("");
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [markupPercent, setMarkupPercent] = useState<number>(50);
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [initialStock, setInitialStock] = useState<number>(1);
  const [minStockThreshold, setMinStockThreshold] = useState<number>(3);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof costPrice === "number" && costPrice > 0) {
      const calculated = Number((costPrice * (1 + markupPercent / 100)).toFixed(2));
      setSellingPrice(calculated);
    }
  }, [costPrice, markupPercent]);

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("/inventory/parts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-parts"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Erro ao cadastrar peça");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !brand || !categoryId || typeof costPrice !== "number" || typeof sellingPrice !== "number") {
      setErrorMsg("Preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      sku: sku.trim().toUpperCase(),
      barcode: barcode.trim() || undefined,
      name: name.trim(),
      brand: brand.trim(),
      categoryId,
      supplier: supplier.trim() || undefined,
      costPrice,
      suggestedMarkupPercent: markupPercent,
      sellingPrice,
      initialStock: Number(initialStock) || 0,
      minStockThreshold: Number(minStockThreshold) || 3,
    });
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

        {errorMsg && (
          <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                SKU (Código Interno) *
              </label>
              <Input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ex: TELA-IP14P-OLED"
                className="h-9 text-xs uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Código de Barras / EAN (Opcional)
              </label>
              <Input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Ex: 7891234567890"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nome da Peça / Descrição *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tela OLED iPhone 14 Pro 120Hz ProMotion"
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Marca Compatível *
              </label>
              <Input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Apple, Samsung"
                className="h-9 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Categoria *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-white px-2 py-1 text-xs shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
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
                Fornecedor (Opcional)
              </label>
              <Input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Ex: Distribuidora SP"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Calculator className="w-3.5 h-3.5 text-primary" />
              Precificação Inteligente
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Custo Unitário (R$) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="0,00"
                  className="h-9 text-xs bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Margem / Markup (%)
                </label>
                <Input
                  type="number"
                  step="5"
                  min="0"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                  placeholder="50"
                  className="h-9 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Preço de Venda (R$) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="0,00"
                  className="h-9 text-xs bg-white font-bold text-primary"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Estoque Inicial (Físico)
              </label>
              <Input
                type="number"
                min="0"
                value={initialStock}
                onChange={(e) => setInitialStock(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Alerta de Estoque Mínimo
              </label>
              <Input
                type="number"
                min="0"
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="h-9 text-xs font-semibold gap-1.5"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <PackagePlus className="w-3.5 h-3.5" />
              )}
              Salvar Peça
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
