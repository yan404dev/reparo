import React from "react";
import { DeviceDTO, PaginatedResponseDTO } from "@fluxos/contracts";
import { serverApiFetch } from "@/lib/server-api";
import { Card, CardContent, TablePaginationFooter } from "@/components/ui";
import { DevicesTable } from "@/features/devices/components/devices-table";
import { DevicesSearchInput } from "@/features/devices/components/devices-search-input";

interface DevicesPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function DevicesPage({ searchParams }: DevicesPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const page = Math.max(1, Number(resolvedParams.page) || 1);

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  queryParams.set("page", String(page));
  queryParams.set("limit", "10");

  const endpoint = `/devices?${queryParams.toString()}`;

  const response = await serverApiFetch<PaginatedResponseDTO<DeviceDTO>>(endpoint).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
  }));

  const devices = response.data;
  const { meta } = response;

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
        <CardContent className="p-4 md:p-5 pb-0">
          <DevicesTable devices={devices} />
        </CardContent>
        <TablePaginationFooter
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
        />
      </Card>
    </div>
  );
}

