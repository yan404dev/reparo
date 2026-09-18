"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Edit } from "lucide-react";
import { PartDTO } from "@fluxos/contracts";
import { TableActionsMenu, ActionItem } from "@/components/ui/table-actions-menu";

interface InventoryTableActionsProps {
  part: PartDTO;
  onOpenEntry?: (part: PartDTO) => void;
  onOpenScrap?: (part: PartDTO) => void;
}

export function InventoryTableActions({
  part,
  onOpenEntry,
  onOpenScrap,
}: InventoryTableActionsProps) {
  const actions: ActionItem[] = [
    {
      label: "Entrada",
      href: `/inventory?modal=stock-entry&partId=${part.id}`,
      onClick: onOpenEntry ? () => onOpenEntry(part) : undefined,
      icon: ArrowUpRight,
      variant: "brand",
    },
    {
      label: "Baixa",
      href: `/inventory?modal=stock-scrap&partId=${part.id}`,
      onClick: onOpenScrap ? () => onOpenScrap(part) : undefined,
      icon: ArrowDownRight,
      variant: "danger",
    },
    {
      label: "Detalhes",
      href: `/inventory/${part.id}`,
      icon: Edit,
      variant: "default",
    },
  ];

  return <TableActionsMenu actions={actions} />;
}
