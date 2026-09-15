import React from "react";
import { DeviceDTO } from "@fluxos/contracts";
import { serverApiFetch } from "@/lib/server-api";
import { Card, CardContent } from "@/components/ui";
import { DevicesTable } from "@/features/devices/components/devices-table";
import { DevicesSearchInput } from "@/features/devices/components/devices-search-input";

interface DevicesPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function DevicesPage({ searchParams }: DevicesPageProps) {
  const { search } = await searchParams;

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/devices?${queryString}` : "/devices";

  let devices: DeviceDTO[] = [];
  try {
    devices = await serverApiFetch<DeviceDTO[]>(endpoint);
  } catch {
    devices = [];
  }

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
        <DevicesSearchInput defaultValue={search} />
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5">
          <DevicesTable devices={devices} />
        </CardContent>
      </Card>
    </div>
  );
}
