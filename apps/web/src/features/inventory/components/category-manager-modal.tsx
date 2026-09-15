"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderPlus, Trash2, Tag, Loader2 } from "lucide-react";
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
  Badge,
} from "@/components/ui";

interface CategoryManagerModalProps {
  categories: CategoryDTO[];
  onClose: () => void;
}

const PRESET_COLORS = [
  { label: "Azul", hex: "#3b82f6" },
  { label: "Verde", hex: "#10b981" },
  { label: "Laranja", hex: "#f59e0b" },
  { label: "Roxo", hex: "#8b5cf6" },
  { label: "Rosa", hex: "#ec4899" },
  { label: "Índigo", hex: "#6366f1" },
  { label: "Cinza", hex: "#64748b" },
  { label: "Vermelho", hex: "#ef4444" },
];

export function CategoryManagerModal({ categories, onClose }: CategoryManagerModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; color: string }) =>
      apiRequest("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      setName("");
      setDescription("");
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-parts"] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Erro ao criar categoria");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/categories/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-parts"] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Erro ao excluir categoria");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Tag className="w-4 h-4 text-primary" />
            Gerenciar Categorias de Peças
          </DialogTitle>
          <DialogDescription className="text-xs">
            Crie e organize categorias dinâmicas com cores e identificadores exclusivos
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-3 p-3 bg-muted/40 rounded-lg border border-border">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nome da Categoria
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Conectores Tipo-C, Telas Incell..."
              className="h-9 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Descrição (Opcional)
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Componentes originais desmontados"
              className="h-9 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Cor da Tag
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c.hex ? "scale-125 border-foreground" : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={createMutation.isPending || !name.trim()}
            className="w-full h-9 text-xs font-semibold gap-1.5"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FolderPlus className="w-3.5 h-3.5" />
            )}
            Adicionar Categoria
          </Button>
        </form>

        <div className="space-y-2 mt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Categorias Existentes ({categories.length})
          </p>
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {categories.map((cat) => {
              const partsCount = cat._count?.parts ?? 0;
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 rounded-md bg-white border border-border text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="truncate">
                      <p className="font-semibold text-foreground truncate">{cat.name}</p>
                      {cat.description && (
                        <p className="text-[11px] text-muted-foreground truncate">{cat.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                      {partsCount} {partsCount === 1 ? "peça" : "peças"}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={partsCount > 0 || deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(cat.id)}
                      title={
                        partsCount > 0
                          ? "Não pode excluir categoria com peças vinculadas"
                          : "Excluir categoria"
                      }
                      className="h-7 w-7 text-muted-foreground hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
