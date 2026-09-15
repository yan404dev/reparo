import React from "react";
import { Smartphone } from "lucide-react";
import { DeviceDTO } from "@fluxos/contracts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "@/components/ui";

interface DevicesTableProps {
  devices: DeviceDTO[];
}

export function DevicesTable({ devices }: DevicesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-sm">Smartphone</TableHead>
          <TableHead className="text-sm">IMEI</TableHead>
          <TableHead className="text-sm">Proprietário</TableHead>
          <TableHead className="text-sm">Cor / Acabamento</TableHead>
          <TableHead className="text-sm">Senha de Testes</TableHead>
          <TableHead className="text-sm pr-3 text-right">Histórico de OS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-12">
              Nenhum aparelho encontrado.
            </TableCell>
          </TableRow>
        ) : (
          devices.map((device: any) => (
            <TableRow key={device.id}>
              <TableCell className="text-sm py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-muted text-primary flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{device.model}</p>
                    <p className="text-xs text-muted-foreground">{device.brand}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm py-2.5 font-mono text-foreground font-medium">
                {device.imei}
              </TableCell>
              <TableCell className="text-sm py-2.5">
                <p className="font-semibold text-foreground">{device.customer?.name}</p>
                <p className="text-xs text-muted-foreground">{device.customer?.phone}</p>
              </TableCell>
              <TableCell className="text-sm py-2.5 text-muted-foreground">
                {device.color || "Padrão"}
              </TableCell>
              <TableCell className="text-sm py-2.5 font-mono text-muted-foreground">
                {device.passcode || "—"}
              </TableCell>
              <TableCell className="text-sm py-2.5 pr-3 text-right">
                <Badge variant="secondary" className="tabular-nums">
                  {device.orders?.length || 0} OS(s)
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
