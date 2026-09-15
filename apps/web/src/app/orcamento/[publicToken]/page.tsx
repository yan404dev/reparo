"use client";

import React, { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Wrench,
  Loader2,
  Calendar,
  FileCheck,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
} from "@/components/ui";

interface PageProps {
  params: Promise<{ publicToken: string }>;
}

export default function PublicQuotePage({ params }: PageProps) {
  const { publicToken } = use(params);
  const queryClient = useQueryClient();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [customerSignature, setCustomerSignature] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["public-order", publicToken],
    queryFn: () => apiRequest(`/orders/public/${publicToken}`),
    retry: 1,
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/orders/public/${publicToken}/approve`, {
        method: "POST",
        body: JSON.stringify({ customerSignature: customerSignature.trim() || undefined }),
      }),
    onSuccess: () => {
      setShowApproveModal(false);
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["public-order", publicToken] });
    },
    onError: (err: any) => {
      setActionError(err.message || "Erro ao aprovar orçamento");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/orders/public/${publicToken}/reject`, {
        method: "POST",
        body: JSON.stringify({ rejectionReason: rejectionReason.trim() || undefined }),
      }),
    onSuccess: () => {
      setShowRejectModal(false);
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["public-order", publicToken] });
    },
    onError: (err: any) => {
      setActionError(err.message || "Erro ao recusar orçamento");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Carregando seu orçamento...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-none text-center p-6">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <h1 className="text-lg font-bold text-foreground">Orçamento não encontrado</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Este link pode ser inválido ou o orçamento foi expirado. Entre em contato com a loja.
          </p>
        </Card>
      </div>
    );
  }

  const checklist = order.entryChecklist || {};
  const isPending = order.status === "AGUARDANDO_APROVACAO" || order.status === "CRIADA";
  const isApproved = ["APROVADA", "EM_REPARO", "TESTES_FINAIS", "PRONTO_RETIRADA", "FINALIZADA"].includes(order.status);
  const isCancelled = order.status === "CANCELADA";

  const checklistItems = [
    { label: "Tela Trincada", issue: checklist.screenBroken, val: checklist.screenBroken ? "Com Trincos" : "Íntegra" },
    { label: "Touch Screen", issue: !checklist.touchWorks, val: checklist.touchWorks ? "OK" : "Com Falhas" },
    { label: "Biometria / Face ID", issue: !checklist.faceIdWorking, val: checklist.faceIdWorking ? "OK" : "Inoperante" },
    { label: "Câmeras", issue: !checklist.camerasOk, val: checklist.camerasOk ? "OK" : "Com Falhas" },
    { label: "Áudio & Microfone", issue: !checklist.audioOk, val: checklist.audioOk ? "OK" : "Com Falhas" },
    { label: "Conector de Carga", issue: !checklist.chargePortWorking, val: checklist.chargePortWorking ? "Carrega" : "Com Mau Contato" },
  ];

  const casingConditionLabels: Record<string, string> = {
    PERFEITO: "Perfeito / Sem Marcas",
    BOM: "Bom Estado",
    MARCAS_DE_USO: "Marcas de Uso / Desgaste",
    TRINCADO: "Trincado / Vidro Quebrado",
    AMASSADO: "Amassado / Empenado",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="bg-white rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground">Reparô</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-semibold text-primary">OS #{order.orderNumber}</span>
              </div>
              <p className="text-xs text-muted-foreground">Portal do Cliente • Aprovação Digital de Orçamento</p>
            </div>
          </div>

          <div>
            {isPending && (
              <Badge variant="secondary" className="gap-1 bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                Aguardando sua Aprovação
              </Badge>
            )}
            {isApproved && (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Orçamento Aprovado
              </Badge>
            )}
            {isCancelled && (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Orçamento Recusado
              </Badge>
            )}
          </div>
        </div>

        {isApproved && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold">Serviço autorizado com sucesso!</p>
              <p className="mt-0.5 text-emerald-700">
                Nosso laboratório técnico já foi notificado e o seu aparelho está na fila de execução. Você receberá atualizações quando estiver pronto para retirada.
              </p>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-semibold">Orçamento Recusado</p>
              <p className="mt-0.5 text-red-700">
                O orçamento não foi aprovado e nenhum procedimento foi iniciado. O aparelho está disponível para retirada na loja.
              </p>
            </div>
          </div>
        )}

        <Card className="shadow-none">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              Dados do Cliente & Aparelho
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground font-medium">Cliente</p>
              <p className="font-semibold text-foreground text-sm mt-0.5">{order.customer?.name}</p>
              <p className="text-muted-foreground mt-0.5">{order.customer?.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Smartphone</p>
              <p className="font-semibold text-foreground text-sm mt-0.5">
                {order.device?.brand} {order.device?.model}
              </p>
              {order.device?.color && (
                <p className="text-muted-foreground mt-0.5">Cor: {order.device.color}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              Diagnóstico & Laudo Técnico
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div>
              <p className="font-semibold text-muted-foreground">Defeito Informado pelo Cliente:</p>
              <p className="mt-1 text-foreground bg-muted/40 p-2.5 rounded-md border border-border">
                {order.reportedDefect}
              </p>
            </div>
            {order.technicalReport && (
              <div>
                <p className="font-semibold text-muted-foreground">Parecer Técnico da Bancada:</p>
                <p className="mt-1 text-foreground bg-blue-50/50 p-2.5 rounded-md border border-blue-100 text-blue-900">
                  {order.technicalReport}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              Checklist de Entrada do Aparelho
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md border flex items-center justify-between ${
                    item.issue ? "bg-red-50/70 border-red-200 text-red-700" : "bg-white border-border text-foreground"
                  }`}
                >
                  <span className="font-medium truncate mr-1">{item.label}</span>
                  <span className="font-semibold shrink-0">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 p-2.5 bg-muted/40 rounded-md border border-border text-[11px]">
              <div>
                <span className="text-muted-foreground">Saúde da Bateria: </span>
                <span className="font-bold text-foreground">
                  {checklist.batteryHealth ? `${checklist.batteryHealth}%` : "Não informada"}
                </span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div>
                <span className="text-muted-foreground">Estado da Carcaça: </span>
                <span className="font-bold text-foreground">
                  {casingConditionLabels[checklist.casingCondition] || checklist.casingCondition || "Bom"}
                </span>
              </div>
            </div>

            {checklist.cosmeticPhotos && checklist.cosmeticPhotos.length > 0 && (
              <div>
                <p className="font-semibold text-muted-foreground mb-1.5">Fotos da Entrada:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {checklist.cosmeticPhotos.map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-video rounded-md overflow-hidden border border-border bg-muted block"
                    >
                      <img src={url} alt={`Foto ${idx + 1}`} className="object-cover w-full h-full" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Itens & Peças do Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="divide-y divide-border">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{item.description}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {item.quantity}x {formatCurrency(item.unitPrice)} • Garantia: {item.warrantyDays} dias
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-foreground text-sm">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-100 rounded-lg space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Total em Peças</span>
                <span>{formatCurrency(order.totalPartsPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Mão de Obra Especializada</span>
                <span>{formatCurrency(order.totalLaborPrice)}</span>
              </div>
              {order.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Desconto Aplicado</span>
                  <span>- {formatCurrency(order.totalDiscount)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-bold text-foreground">
                <span>Valor Total Final</span>
                <span className="text-primary text-base">{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {isPending && (
          <div className="sticky bottom-4 z-40 bg-white p-4 rounded-xl border border-border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Total do Orçamento:</p>
              <p className="text-xl font-extrabold text-primary">{formatCurrency(order.grandTotal)}</p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(true)}
                className="flex-1 sm:flex-initial h-10 text-xs text-muted-foreground hover:text-destructive border-border"
              >
                <ThumbsDown className="w-3.5 h-3.5 mr-1" />
                Recusar
              </Button>
              <Button
                onClick={() => setShowApproveModal(true)}
                className="flex-1 sm:flex-initial h-10 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Aprovar Orçamento
              </Button>
            </div>
          </div>
        )}

        <div className="text-center text-[11px] text-muted-foreground pb-6">
          Reparô • Assistência Técnica e Gestão Especializada
        </div>
      </div>

      {showApproveModal && (
        <Dialog open onOpenChange={() => setShowApproveModal(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Aprovação do Orçamento
              </DialogTitle>
              <DialogDescription className="text-xs">
                Ao aprovar, você autoriza o início imediato do reparo no valor de{" "}
                <strong>{formatCurrency(order.grandTotal)}</strong>.
              </DialogDescription>
            </DialogHeader>

            {actionError && (
              <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                {actionError}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Confirme seu Nome Completo (Assinatura Digital)
                </label>
                <Input
                  type="text"
                  value={customerSignature}
                  onChange={(e) => setCustomerSignature(e.target.value)}
                  placeholder={order.customer?.name || "Digite seu nome"}
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApproveModal(false)}
                  className="h-9 text-xs"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  disabled={approveMutation.isPending}
                  onClick={() => approveMutation.mutate()}
                  className="h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ThumbsUp className="w-3.5 h-3.5" />
                  )}
                  Confirmar e Autorizar Reparo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showRejectModal && (
        <Dialog open onOpenChange={() => setShowRejectModal(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2 text-destructive">
                <XCircle className="w-4 h-4" />
                Recusar Orçamento
              </DialogTitle>
              <DialogDescription className="text-xs">
                Informe o motivo pelo qual você optou por não realizar o conserto (opcional).
              </DialogDescription>
            </DialogHeader>

            {actionError && (
              <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                {actionError}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Motivo da Recusa (Opcional)
                </label>
                <Input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ex: Valor acima do esperado, prefiro comprar outro..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectModal(false)}
                  className="h-9 text-xs"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  disabled={rejectMutation.isPending}
                  onClick={() => rejectMutation.mutate()}
                  variant="destructive"
                  className="h-9 text-xs font-semibold gap-1"
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ThumbsDown className="w-3.5 h-3.5" />
                  )}
                  Confirmar Recusa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
