"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input, Card, CardContent } from "@/components/ui";
import { useDevices } from "@/features/devices/hooks/use-devices";
import { DevicesTable } from "@/features/devices/components/devices-table";

export default function DevicesPage() {
  const { devices, isLoading, search, setSearch } = useDevices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight shrink-0">
            Aparelhos & Rastreabilidade de IMEI
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Base cadastrada de smartphones e histórico de passagens técnicas
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por IMEI, modelo ou marca..."
            className="h-9 pl-8 pr-3 text-sm w-full"
          />
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5">
          <DevicesTable devices={devices} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
