import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "./order-status-badge";
import { ServiceOrderDTO } from "@fluxos/contracts";
import { Button } from "@/components/ui";

interface OrderDetailHeaderProps {
  order: ServiceOrderDTO;
}

export function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-md shadow-none bg-white">
        <Link href="/orders">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">OS #{order.orderNumber}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Criada em {formatDate(order.createdAt)}</p>
      </div>
    </div>
  );
}
