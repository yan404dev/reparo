"use client";

import React from "react";
import { MessageCircle, Eye, PlusCircle } from "lucide-react";
import { CustomerDTO } from "@fluxos/contracts";
import { TableActionsMenu, ActionItem } from "@/components/ui/table-actions-menu";

interface CustomersTableActionsProps {
  customer: CustomerDTO;
}

export function CustomersTableActions({
  customer,
}: CustomersTableActionsProps) {
  const cleanPhone = customer.phone?.replace(/\D/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
        `Olá ${customer.name}, tudo bem? Aqui é da assistência técnica.`
      )}`
    : undefined;

  const actions: ActionItem[] = [];

  if (whatsappUrl) {
    actions.push({
      label: "WhatsApp",
      href: whatsappUrl,
      icon: MessageCircle,
      variant: "brand",
      target: "_blank",
      rel: "noopener noreferrer",
    });
  }

  actions.push({
    label: "Nova OS",
    href: `/orders/new?customerId=${customer.id}`,
    icon: PlusCircle,
    variant: "default",
  });

  actions.push({
    label: "Ver Perfil",
    href: `/customers/${customer.id}`,
    icon: Eye,
    variant: "default",
  });

  return <TableActionsMenu actions={actions} />;
}
