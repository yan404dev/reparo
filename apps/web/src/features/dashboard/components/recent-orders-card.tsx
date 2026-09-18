import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceOrderDTO } from "@fluxos/contracts";
import {
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from "@/components/ui";
import { RecentOrdersTableRow } from "./recent-orders-table-row";

interface RecentOrdersCardProps {
  orders: ServiceOrderDTO[];
}

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold tracking-tight">
            Ordens de Serviço Recentes
          </h2>
          <Button variant="outline" size="sm" asChild className="h-8 px-3 text-xs font-semibold shadow-none bg-white">
            <Link href="/orders" className="flex items-center gap-1.5 text-foreground hover:text-primary">
              <span>Ver todas</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">OS</TableHead>
              <TableHead className="text-sm">Cliente & Aparelho</TableHead>
              <TableHead className="text-sm">Status</TableHead>
              <TableHead className="text-sm text-right">Total Geral</TableHead>
              <TableHead className="text-sm text-right pr-3">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-muted-foreground py-8"
                >
                  Nenhuma ordem cadastrada no momento.
                </TableCell>
              </TableRow>
            ) : (
              orders.slice(0, 5).map((order) => (
                <RecentOrdersTableRow key={order.id} order={order} />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
