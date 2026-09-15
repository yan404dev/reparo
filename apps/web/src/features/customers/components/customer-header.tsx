import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Plus } from "lucide-react";
import { CustomerDTO } from "@fluxos/contracts";
import { formatDate } from "@/lib/utils";
import { Button, Badge } from "@/components/ui";

interface CustomerHeaderProps {
  customer: CustomerDTO;
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-md shadow-none bg-white">
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {customer.name}
            </h1>
            {customer.isRecurrent ? (
              <Badge className="bg-blue-600 text-white border-none shadow-none text-xs">
                Cliente VIP / Recorrente
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Cliente Cadastrado
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            CPF: <span className="font-mono font-medium text-foreground">{customer.displayDocument || "—"}</span> • Cadastrado em {formatDate(customer.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {customer.whatsappUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 shadow-none font-medium gap-1.5"
          >
            <a href={customer.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Conversar no WhatsApp</span>
            </a>
          </Button>
        )}

        <Button size="sm" asChild className="shadow-none font-medium gap-1.5">
          <Link
            href={`/orders/new?cpf=${customer.document || ""}&name=${encodeURIComponent(
              customer.name
            )}&phone=${encodeURIComponent(customer.phone || "")}`}
          >
            <Plus className="w-4 h-4" />
            <span>Nova OS para este Cliente</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
