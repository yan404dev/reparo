import React from "react";
import { FileText, Smartphone, TrendingUp, Clock } from "lucide-react";
import { CustomerDTO } from "@fluxos/contracts";
import { Card, CardContent } from "@/components/ui";

interface CustomerKpisProps {
  customer: CustomerDTO;
}

export function CustomerKpis({ customer }: CustomerKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <Card className="shadow-none">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Ordens de Serviço</p>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {customer.orders?.length || 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Aparelhos Cadastrados</p>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {customer.devices?.length || 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Investido</p>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {customer.displayTotalSpent || "R$ 0,00"}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">OSs em Andamento</p>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {customer.activeOrdersCount || 0}
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
