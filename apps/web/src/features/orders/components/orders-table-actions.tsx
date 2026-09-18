"use client";

import React from "react";
import { MessageCircle, Eye, Printer, Copy } from "lucide-react";
import { ServiceOrderDTO } from "@fluxos/contracts";
import { TableActionsMenu, ActionItem } from "@/components/ui/table-actions-menu";

interface OrdersTableActionsProps {
  order: ServiceOrderDTO;
}

export function OrdersTableActions({ order }: OrdersTableActionsProps) {
  const actions: ActionItem[] = [];

  if (order.publicToken) {
    actions.push({
      label: "Copiar Orçamento Online",
      onClick: async () => {
        const url = `${window.location.origin}/orcamento/${order.publicToken}`;
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          // Fallback
        }
      },
      icon: Copy,
      variant: "brand",
    });
  }

  if (order.whatsappUrl) {
    actions.push({
      label: "WhatsApp",
      href: order.whatsappUrl,
      icon: MessageCircle,
      variant: "brand",
      target: "_blank",
      rel: "noopener noreferrer",
    });
  }

  actions.push({
    label: "Detalhes",
    href: `/orders/${order.id}`,
    icon: Eye,
    variant: "default",
  });

  actions.push({
    label: "Imprimir",
    href: `/orders/${order.id}/print`,
    icon: Printer,
    variant: "default",
  });

  return <TableActionsMenu actions={actions} />;
}
