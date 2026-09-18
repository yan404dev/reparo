"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PackagePlus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { CategoryDTO, CreatePartSchema, CreatePartInput } from "@fluxos/contracts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  SectionDivider,
  ModalFormFooter,
} from "@/components/ui";
import { PartBasicFields } from "./part-basic-fields";
import { PartPricingFields } from "./part-pricing-fields";
import { PartStockFields } from "./part-stock-fields";

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
  const sellingPrice = watch("sellingPrice");
  const markupPercent = watch("suggestedMarkupPercent");
  const categoryId = watch("categoryId");

  const handleCostChange = (val: number) => {
    setValue("costPrice", val, { shouldValidate: true });
    if (val > 0) {
      setValue(
        "sellingPrice",
        Number((val * (1 + (markupPercent || 50) / 100)).toFixed(2)),
        { shouldValidate: true }
      );
    }
  };

  const handleSellingChange = (val: number) => {
    setValue("sellingPrice", val, { shouldValidate: true });
  };

  const updateMarkup = (percent: number) => {
    setValue("suggestedMarkupPercent", percent);
    if (costPrice > 0) {
      setValue(
        "sellingPrice",
        Number((costPrice * (1 + percent / 100)).toFixed(2)),
        { shouldValidate: true }
      );
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <PackagePlus className="w-5 h-5 text-primary" />
            Cadastrar Nova Peça
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cadastre um novo componente ou insumo com precificação dinâmica
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-3 pt-1">
          <PartBasicFields
            skuRegister={register("sku")}
            barcodeRegister={register("barcode")}
            nameRegister={register("name")}
            brandRegister={register("brand")}
            supplierRegister={register("supplier")}
            categoryId={categoryId}
            categories={categories}
            onCategoryChange={(val) => setValue("categoryId", val)}
            errors={errors}
          />

          <SectionDivider label="Precificação & Margem" />

          <PartPricingFields
            costPrice={costPrice}
            sellingPrice={sellingPrice}
            onCostChange={handleCostChange}
            onSellingChange={handleSellingChange}
            markupPercent={markupPercent}
            onMarkupChange={updateMarkup}
            costError={errors.costPrice?.message}
            sellingError={errors.sellingPrice?.message}
          />

          <SectionDivider label="Controle de Estoque" />

          <PartStockFields
            initialStockRegister={register("initialStock", { valueAsNumber: true })}
            minStockRegister={register("minStockThreshold", { valueAsNumber: true })}
            initialStockError={errors.initialStock?.message}
            minStockError={errors.minStockThreshold?.message}
          />

          <ModalFormFooter
            onCancel={onClose}
            isPending={createMutation.isPending}
            submitLabel="Cadastrar Peça"
            loadingLabel="Cadastrando..."
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
