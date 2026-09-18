import React from "react";
import { CustomerDTO } from "@fluxos/contracts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";
import { CustomersTableRow } from "./customers-table-row";

interface CustomersTableProps {
  customers: CustomerDTO[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-sm">Cliente</TableHead>
          <TableHead className="text-sm">CPF / Documento</TableHead>
          <TableHead className="text-sm">Contato</TableHead>
          <TableHead className="text-sm text-center">Total de OSs</TableHead>
          <TableHead className="text-sm">Status</TableHead>
          <TableHead className="text-sm pr-3 text-right">Ações Rápidas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-sm text-muted-foreground py-12"
            >
              Nenhum cliente encontrado com os filtros atuais.
            </TableCell>
          </TableRow>
        ) : (
          customers.map((c) => (
            <CustomersTableRow key={c.id} customer={c} />
          ))
        )}
      </TableBody>
    </Table>
  );
}
