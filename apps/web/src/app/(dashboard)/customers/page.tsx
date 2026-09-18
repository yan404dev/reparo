import React from "react";
import { Card, CardContent, TablePaginationFooter } from "@/components/ui";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { CustomersTableToolbar } from "@/features/customers/components/customers-table-toolbar";
import { CustomersKpiCards } from "@/features/customers/components/customers-kpi-cards";
import { serverApiFetch } from "@/lib/server-api";
import { CustomerDTO, PaginatedResponseDTO } from "@fluxos/contracts";

interface CustomersPageProps {
  searchParams: Promise<{
    search?: string;
    filter?: string;
    page?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const filter = resolvedParams.filter || "ALL";
  const page = Math.max(1, Number(resolvedParams.page) || 1);

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  queryParams.append("page", String(page));
  queryParams.append("limit", "10");

  const endpoint = `/customers?${queryParams.toString()}`;
  const response = await serverApiFetch<PaginatedResponseDTO<CustomerDTO>>(endpoint).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
  }));

  const allCustomers = response.data;
  const { meta } = response;

  const totalCustomers = meta.totalItems;
  const recurrentCount = allCustomers.filter((c) => c.isRecurrent).length;
  const activeOrdersSum = allCustomers.reduce((acc, c) => acc + (c.activeOrdersCount || 0), 0);
  const totalSpentSum = allCustomers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);

  const displayTotalSpentSum = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalSpentSum);

  let filteredCustomers = allCustomers;
  if (filter === "ACTIVE") {
    filteredCustomers = allCustomers.filter((c) => c.hasActiveOrders);
  } else if (filter === "RECURRENT") {
    filteredCustomers = allCustomers.filter((c) => c.isRecurrent);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Clientes & Histórico
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Base unificada com linha do tempo de atendimentos e aparelhos
        </p>
      </div>

      <CustomersKpiCards
        totalCustomers={totalCustomers}
        recurrentCount={recurrentCount}
        activeOrdersSum={activeOrdersSum}
        displayTotalSpentSum={displayTotalSpentSum}
      />

      <CustomersTableToolbar initialSearch={search} />

      <Card className="shadow-none">
        <CardContent className="p-0">
          <CustomersTable customers={filteredCustomers} />
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


