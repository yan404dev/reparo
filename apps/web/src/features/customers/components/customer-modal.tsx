"use client";

import React from "react";
import { useCustomerForm } from "../hooks/use-customer-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from "@/components/ui";

interface CustomerModalProps {
  onClose: () => void;
}

export function CustomerModal({ onClose }: CustomerModalProps) {
  const { form, error, isSubmitting, onSubmit } = useCustomerForm({
    onSuccess: onClose,
  });

  const { register, formState: { errors } } = form;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
          <DialogDescription>
            Dados cadastrais para abertura de ordens e notificações
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Nome Completo *
            </label>
            <Input
              type="text"
              {...register("name")}
              placeholder="Ex: Fernando Alcantara"
            />
            {errors.name && (
              <span className="text-xs text-destructive mt-1 block">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Telefone / WhatsApp *
            </label>
            <Input
              type="text"
              {...register("phone")}
              placeholder="(11) 98888-7777"
            />
            {errors.phone && (
              <span className="text-xs text-destructive mt-1 block">{errors.phone.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              CPF / CNPJ
            </label>
            <Input
              type="text"
              {...register("document")}
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              E-mail
            </label>
            <Input
              type="email"
              {...register("email")}
              placeholder="cliente@email.com"
            />
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
              {isSubmitting ? "Gravando..." : "Salvar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
