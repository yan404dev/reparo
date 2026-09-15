"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Plus, AlertCircle } from "lucide-react";
import { useOrderDetail } from "@/features/orders/hooks/use-order-detail";
import { OrderDetailHeader } from "@/features/orders/components/order-detail-header";
import { OrderStatusActions } from "@/features/orders/components/order-status-actions";
import { OrderInfoCards } from "@/features/orders/components/order-info-cards";
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
    showError,
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
        <OrderDetailHeader order={order} />
        <OrderStatusActions
          order={order}
          isUpdating={isUpdatingStatus}
          onUpdateStatus={updateStatus}
        />
      </div>

      {actionError && (
        <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      <OrderInfoCards order={order} />

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
              <Button size="sm" onClick={() => setShowItemModal(true)} className="shadow-none">
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
          onError={showError}
        />
      )}
    </div>
  );
}
