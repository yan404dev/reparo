"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  Smartphone,
  User,
  Plus,
  CheckCircle,
  Play,
  Check,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { OrderStatus } from "@fluxos/contracts";
import { useOrderDetail } from "@/features/orders/hooks/use-order-detail";
import { StatusBadge } from "@/features/orders/components/order-status-badge";
import { OrderChecklistForm } from "@/features/orders/components/order-checklist-form";
import { OrderItemsList } from "@/features/orders/components/order-items-list";
import { AddItemModal } from "@/features/orders/components/add-item-modal";
import { Card, CardContent, Button } from "@/components/ui";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    order,
    isLoading,
    compatibleParts,
    actionError,
    setActionError,
    showItemModal,
    setShowItemModal,
    isUpdatingStatus,
    updateStatus,
    removeItem,
  } = useOrderDetail(id);

  if (isLoading || !order) {
    return (
      <Card className="shadow-none">
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Carregando detalhes da Ordem de Serviço...
        </CardContent>
      </Card>
    );
  }

  const canEdit = order.status === "CRIADA" || order.status === "AGUARDANDO_APROVACAO";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-md shadow-none bg-white">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">OS #{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Criada em {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {order.status === "CRIADA" && (
            <Button
              size="sm"
              onClick={() => updateStatus(OrderStatus.AGUARDANDO_APROVACAO)}
              disabled={isUpdatingStatus}
              className="bg-amber-500 hover:bg-amber-600 text-white shadow-none"
            >
              <Clock className="w-3.5 h-3.5 mr-1" />
              <span>Enviar p/ Aprovação</span>
            </Button>
          )}

          {order.status === "AGUARDANDO_APROVACAO" && (
            <>
              <Button
                size="sm"
                onClick={() => updateStatus(OrderStatus.APROVADA)}
                disabled={isUpdatingStatus}
                className="shadow-none"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                <span>Aprovar (Reservar Peças)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus(OrderStatus.CANCELADA)}
                disabled={isUpdatingStatus}
                className="shadow-none text-destructive hover:text-destructive"
              >
                Recusar
              </Button>
            </>
          )}

          {order.status === "APROVADA" && (
            <>
              <Button
                size="sm"
                onClick={() => updateStatus(OrderStatus.EM_REPARO)}
                disabled={isUpdatingStatus}
                className="shadow-none"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                <span>Iniciar Reparo (Baixa Peças)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus(OrderStatus.CANCELADA)}
                disabled={isUpdatingStatus}
                className="shadow-none text-destructive hover:text-destructive"
              >
                Cancelar & Estornar Reserva
              </Button>
            </>
          )}

          {order.status === "EM_REPARO" && (
            <Button
              size="sm"
              onClick={() => updateStatus(OrderStatus.TESTES_FINAIS)}
              disabled={isUpdatingStatus}
              className="shadow-none"
            >
              <Wrench className="w-3.5 h-3.5 mr-1" />
              <span>Concluir Reparo & Ir p/ Testes</span>
            </Button>
          )}

          {order.status === "TESTES_FINAIS" && (
            <Button
              size="sm"
              onClick={() => updateStatus(OrderStatus.PRONTO_RETIRADA)}
              disabled={isUpdatingStatus}
              className="bg-green-600 hover:bg-green-700 text-white shadow-none"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>Aprovar Testes & Pronto p/ Retirada</span>
            </Button>
          )}

          {order.status === "PRONTO_RETIRADA" && (
            <Button
              size="sm"
              onClick={() => updateStatus(OrderStatus.FINALIZADA)}
              disabled={isUpdatingStatus}
              className="bg-green-700 hover:bg-green-800 text-white shadow-none"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>Entregar ao Cliente & Iniciar Garantia 90d</span>
            </Button>
          )}
        </div>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Cliente</span>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{order.customer?.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{order.customer?.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Smartphone className="w-3.5 h-3.5 text-primary" />
              <span>Aparelho</span>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{order.device?.model}</p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">IMEI: {order.device?.imei}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Wrench className="w-3.5 h-3.5 text-primary" />
              <span>Responsáveis</span>
            </div>
            <div>
              <p className="text-xs text-foreground">
                <span className="font-medium text-muted-foreground">Técnico:</span>{" "}
                {order.technician?.name || "Não atribuído"}
              </p>
              <p className="text-xs text-foreground mt-0.5">
                <span className="font-medium text-muted-foreground">Atendente:</span> {order.attendant?.name}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5 space-y-4">
          <h2 className="text-base font-semibold tracking-tight">Checklist de Entrada</h2>
          <OrderChecklistForm checklist={order.entryChecklist} readOnly={true} />
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent className="p-4 md:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Itens do Orçamento</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Rastreamento de peças e garantia individual</p>
            </div>

            {canEdit && (
              <Button
                size="sm"
                onClick={() => setShowItemModal(true)}
                className="shadow-none"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Adicionar Peça / Serviço</span>
              </Button>
            )}
          </div>

          <OrderItemsList order={order} onRemoveItem={removeItem} canEdit={canEdit} />
        </CardContent>
      </Card>

      {showItemModal && (
        <AddItemModal
          orderId={order.id}
          compatibleParts={compatibleParts}
          onClose={() => setShowItemModal(false)}
          onError={(msg) => setActionError(msg)}
        />
      )}
    </div>
  );
}
