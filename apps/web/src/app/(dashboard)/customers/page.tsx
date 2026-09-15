import React from "react";
import { Card, CardContent } from "@/components/ui";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { CustomersSearchInput } from "@/features/customers/components/customers-search-input";
import { CustomersFilterTabs } from "@/features/customers/components/customers-filter-tabs";
import { serverApiFetch } from "@/lib/server-api";
import { CustomerDTO } from "@fluxos/contracts";
import { AlertCircle, RefreshCw, Smartphone, TrendingUp, Users } from "lucide-react";

interface CustomersPageProps {
  searchParams: Promise<{
    search?: string;
    filter?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const filter = resolvedParams.filter || "ALL";

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);

  const endpoint = `/customers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const allCustomers = await serverApiFetch<CustomerDTO[]>(endpoint).catch(() => []);

  // Métricas agregadas do lote retornado
  const totalCustomers = allCustomers.length;
  const recurrentCount = allCustomers.filter((c) => c.isRecurrent).length;
  const activeOrdersSum = allCustomers.reduce((acc, c) => acc + (c.activeOrdersCount || 0), 0);
  const totalSpentSum = allCustomers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);

  const displayTotalSpentSum = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalSpentSum);

  // Aplica filtro de aba da URL
  let filteredCustomers = allCustomers;
  if (filter === "ACTIVE") {
    filteredCustomers = allCustomers.filter((c) => c.hasActiveOrders);
  } else if (filter === "RECURRENT") {
    filteredCustomers = allCustomers.filter((c) => c.isRecurrent);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight shrink-0">
            Clientes & Histórico
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Base unificada por CPF com linha do tempo de atendimentos e aparelhos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total de Clientes</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {totalCustomers}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Clientes Recorrentes</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {recurrentCount}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">OSs Ativas no Momento</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {activeOrdersSum}
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
              <p className="text-xs font-medium text-muted-foreground">Faturamento Acumulado</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {displayTotalSpentSum}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <CustomersSearchInput defaultValue={search} />
        <CustomersFilterTabs currentFilter={filter} totalCount={totalCustomers} />
      </div>

      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-blue-800 text-xs">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Cadastro Automático por CPF:</strong> Os clientes são unificados automaticamente pelo CPF na abertura de cada Ordem de Serviço. Clique em um cliente para ver os detalhes e a <strong>linha do tempo em timelapse</strong>.
        </span>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-0">
          <CustomersTable customers={filteredCustomers} />
        </CardContent>
      </Card>
    </div>
  );
}
