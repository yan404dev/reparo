"use client";

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { useOrdersList } from "@/features/orders/hooks/use-orders-list";
import { OrdersTable } from "@/features/orders/components/orders-table";

export default function OrdersPage() {
  const {
    orders,
    isLoading,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    statusTabs,
  } = useOrdersList();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight shrink-0">
          Ordens de Serviço
        </h1>
        <Button size="sm" className="shadow-none" asChild>
          <Link href="/orders/new">Nova Ordem</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, IMEI ou modelo..."
            className="h-9 pl-8 pr-3 text-sm w-full"
          />
        </div>

        <div className="inline-flex h-9 items-center rounded-md bg-white border border-border p-1 gap-1 overflow-x-auto max-w-full">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`h-7 px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors flex items-center justify-center ${
                statusFilter === tab.id
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5">
          <OrdersTable orders={orders} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
