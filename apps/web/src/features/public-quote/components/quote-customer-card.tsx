import React from "react";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { SectionDivider } from "./section-divider";

interface QuoteCustomerCardProps {
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  deviceColor?: string;
}

export function QuoteCustomerCard({
  customerName,
  customerPhone,
  deviceBrand,
  deviceModel,
  deviceColor,
}: QuoteCustomerCardProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5 space-y-4">
        <SectionDivider icon={User} title="Dados do Cliente & Aparelho" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-0.5">
            <p className="text-muted-foreground font-medium">Cliente</p>
            <p className="font-semibold text-foreground text-sm">{customerName}</p>
            <p className="text-muted-foreground">{customerPhone}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-muted-foreground font-medium">Smartphone</p>
            <p className="font-semibold text-foreground text-sm">
              {deviceBrand} {deviceModel}
            </p>
            {deviceColor && <p className="text-muted-foreground">Cor: {deviceColor}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
