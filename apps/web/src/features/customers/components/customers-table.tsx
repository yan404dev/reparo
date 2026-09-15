"use client";

import React from "react";
import { Users } from "lucide-react";
import { CustomerDTO } from "@fluxos/contracts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "@/components/ui";

interface CustomersTableProps {
  customers: CustomerDTO[];
  isLoading: boolean;
}

export function CustomersTable({ customers, isLoading }: CustomersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-sm">Cliente</TableHead>
          <TableHead className="text-sm">Contato</TableHead>
          <TableHead className="text-sm">CPF / CNPJ</TableHead>
          <TableHead className="text-sm text-center">Aparelhos</TableHead>
          <TableHead className="text-sm pr-3 text-right">Ordens de Serviço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-12">
              Carregando clientes...
            </TableCell>
          </TableRow>
        ) : customers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-12">
              Nenhum cliente cadastrado.
            </TableCell>
          </TableRow>
        ) : (
          customers.map((c: any) => (
            <TableRow key={c.id}>
              <TableCell className="text-sm py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-muted text-primary flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email || "Sem e-mail"}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm py-2.5 text-foreground font-medium">
                {c.phone}
              </TableCell>
              <TableCell className="text-sm py-2.5 font-mono text-muted-foreground">
                {c.document || "—"}
              </TableCell>
              <TableCell className="text-sm py-2.5 text-center font-bold tabular-nums text-foreground">
                {c.devices?.length || 0}
              </TableCell>
              <TableCell className="text-sm py-2.5 pr-3 text-right">
                <Badge variant="secondary" className="tabular-nums">
                  {c._count?.orders || 0} OS(s)
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
