import React from "react";
import { User, Smartphone, Wrench } from "lucide-react";
import { ServiceOrderDTO } from "@fluxos/contracts";
import { Card, CardContent } from "@/components/ui";

interface OrderInfoCardsProps {
  order: ServiceOrderDTO;
}

export function OrderInfoCards({ order }: OrderInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-none">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>Cliente</span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{order.customer?.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.customer?.phone}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Smartphone className="w-3.5 h-3.5 text-primary" />
            <span>Aparelho</span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{order.device?.model}</p>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">IMEI: {order.device?.imei}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Wrench className="w-3.5 h-3.5 text-primary" />
            <span>Responsáveis</span>
          </div>
          <div>
            <p className="text-xs text-foreground">
              <span className="font-medium text-muted-foreground">Técnico:</span>{" "}
              {order.technician?.name || "Não atribuído"}
            </p>
            <p className="text-xs text-foreground mt-0.5">
              <span className="font-medium text-muted-foreground">Atendente:</span> {order.attendant?.name}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
