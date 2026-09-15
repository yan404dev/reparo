"use client";

import React from "react";
import { Plus, Search } from "lucide-react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { useCustomers } from "@/features/customers/hooks/use-customers";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { CustomerModal } from "@/features/customers/components/customer-modal";

export default function CustomersPage() {
  const { customers, isLoading, search, setSearch, showModal, setShowModal } = useCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight shrink-0">
            Clientes Cadastrados
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestão de contatos e histórico de smartphones e ordens
          </p>
        </div>

        <Button
          size="sm"
          className="shadow-none"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Novo Cliente</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone ou documento..."
            className="h-9 pl-8 pr-3 text-sm w-full"
          />
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5">
          <CustomersTable customers={customers} isLoading={isLoading} />
        </CardContent>
      </Card>

      {showModal && <CustomerModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
