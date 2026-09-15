"use client";

import React from "react";
import { Wrench, CheckCircle, Play, Check, Clock, ShieldCheck } from "lucide-react";
import { OrderStatus, ServiceOrderDTO } from "@fluxos/contracts";
import { Button } from "@/components/ui";

interface OrderStatusActionsProps {
  order: ServiceOrderDTO;
  isUpdating: boolean;
  onUpdateStatus: (status: OrderStatus) => void;
}

export function OrderStatusActions({ order, isUpdating, onUpdateStatus }: OrderStatusActionsProps) {
  const { status } = order;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === OrderStatus.CRIADA && (
        <Button
          size="sm"
          onClick={() => onUpdateStatus(OrderStatus.AGUARDANDO_APROVACAO)}
          disabled={isUpdating}
          className="bg-amber-500 hover:bg-amber-600 text-white shadow-none"
        >
          <Clock className="w-3.5 h-3.5 mr-1" />
          <span>Enviar p/ Aprovação</span>
        </Button>
      )}

      {status === OrderStatus.AGUARDANDO_APROVACAO && (
        <>
          <Button
            size="sm"
            onClick={() => onUpdateStatus(OrderStatus.APROVADA)}
            disabled={isUpdating}
            className="shadow-none"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            <span>Aprovar (Reservar Peças)</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(OrderStatus.CANCELADA)}
            disabled={isUpdating}
            className="shadow-none text-destructive hover:text-destructive"
          >
            Recusar
          </Button>
        </>
      )}

      {status === OrderStatus.APROVADA && (
        <>
          <Button
            size="sm"
            onClick={() => onUpdateStatus(OrderStatus.EM_REPARO)}
            disabled={isUpdating}
            className="shadow-none"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            <span>Iniciar Reparo (Baixa Peças)</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStatus(OrderStatus.CANCELADA)}
            disabled={isUpdating}
            className="shadow-none text-destructive hover:text-destructive"
          >
            Cancelar & Estornar
          </Button>
        </>
      )}

      {status === OrderStatus.EM_REPARO && (
        <Button
          size="sm"
          onClick={() => onUpdateStatus(OrderStatus.TESTES_FINAIS)}
          disabled={isUpdating}
          className="shadow-none"
        >
          <Wrench className="w-3.5 h-3.5 mr-1" />
          <span>Concluir Reparo & Testar</span>
        </Button>
      )}

      {status === OrderStatus.TESTES_FINAIS && (
        <Button
          size="sm"
          onClick={() => onUpdateStatus(OrderStatus.PRONTO_RETIRADA)}
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700 text-white shadow-none"
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          <span>Pronto p/ Retirada</span>
        </Button>
      )}

      {status === OrderStatus.PRONTO_RETIRADA && (
        <Button
          size="sm"
          onClick={() => onUpdateStatus(OrderStatus.FINALIZADA)}
          disabled={isUpdating}
          className="bg-green-700 hover:bg-green-800 text-white shadow-none"
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          <span>Entregar & Iniciar Garantia</span>
        </Button>
      )}
    </div>
  );
}
