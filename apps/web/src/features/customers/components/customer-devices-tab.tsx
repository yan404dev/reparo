import React from "react";
import Link from "next/link";
import { Smartphone, Plus } from "lucide-react";
import { DeviceDTO } from "@fluxos/contracts";
import { Card, CardContent, Button } from "@/components/ui";

interface CustomerDevicesTabProps {
  devices?: DeviceDTO[];
  customerDocument?: string | null;
}

export function CustomerDevicesTab({ devices, customerDocument }: CustomerDevicesTabProps) {
  if (!devices || devices.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-12 text-center text-muted-foreground text-sm">
          Nenhum aparelho registrado ainda.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <Card key={device.id} className="shadow-none hover:border-primary/50 transition-colors">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  {device.brand} {device.model}
                </h4>
                <p className="text-xs text-muted-foreground">{device.color || "Cor não informada"}</p>
              </div>
            </div>

            <div className="space-y-1 text-xs border-t border-border pt-2 text-muted-foreground">
              <p>
                IMEI / Serial: <span className="font-mono font-medium text-foreground">{device.imei}</span>
              </p>
              {device.passcode && (
                <p>
                  Senha de Tela: <span className="font-mono font-medium text-foreground">{device.passcode}</span>
                </p>
              )}
              <p>
                Histórico: <strong className="text-foreground font-semibold">{(device as any).orders?.length || 0} OS(s)</strong> realizada(s)
              </p>
            </div>

            <Button variant="outline" size="sm" asChild className="w-full text-xs h-8 shadow-none gap-1 font-medium">
              <Link href={`/orders/new?cpf=${customerDocument || ""}&deviceId=${device.id}`}>
                <Plus className="w-3.5 h-3.5" />
                <span>Abrir OS com este Aparelho</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
