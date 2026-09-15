"use client";

import React, { use } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { usePublicQuote } from "@/features/public-quote/hooks/use-public-quote";
import { QuoteHeader } from "@/features/public-quote/components/quote-header";
import { QuoteStatusBanner } from "@/features/public-quote/components/quote-status-banner";
import { QuoteCustomerCard } from "@/features/public-quote/components/quote-customer-card";
import { QuoteDiagnosticCard } from "@/features/public-quote/components/quote-diagnostic-card";
import { QuoteChecklistCard } from "@/features/public-quote/components/quote-checklist-card";
import { QuoteItemsCard } from "@/features/public-quote/components/quote-items-card";
import { QuoteActionBar } from "@/features/public-quote/components/quote-action-bar";
import { QuoteApproveModal } from "@/features/public-quote/components/quote-approve-modal";
import { QuoteRejectModal } from "@/features/public-quote/components/quote-reject-modal";

interface PageProps {
  params: Promise<{ publicToken: string }>;
}

export default function PublicQuotePage({ params }: PageProps) {
  const { publicToken } = use(params);
  const quote = usePublicQuote(publicToken);

  if (quote.isLoading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Carregando seu orçamento...</p>
        </div>
      </div>
    );
  }

  if (quote.error || !quote.order) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-none text-center">
          <CardContent className="p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Orçamento não encontrado</h1>
            <p className="text-xs text-muted-foreground">
              Este link pode ser inválido ou o orçamento foi expirado. Entre em contato com a loja.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { order } = quote;
  const checklist = order.entryChecklist || {};

  const checklistItems = [
    { label: "Tela Trincada", issue: checklist.screenBroken, val: checklist.screenBroken ? "Com Trincos" : "Íntegra" },
    { label: "Touch Screen", issue: !checklist.touchWorks, val: checklist.touchWorks ? "OK" : "Com Falhas" },
    { label: "Biometria / Face ID", issue: !checklist.faceIdWorking, val: checklist.faceIdWorking ? "OK" : "Inoperante" },
    { label: "Câmeras", issue: !checklist.camerasOk, val: checklist.camerasOk ? "OK" : "Com Falhas" },
    { label: "Áudio & Microfone", issue: !checklist.audioOk, val: checklist.audioOk ? "OK" : "Com Falhas" },
    { label: "Conector de Carga", issue: !checklist.chargePortWorking, val: checklist.chargePortWorking ? "Carrega" : "Com Mau Contato" },
  ];

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <QuoteHeader
          orderNumber={order.orderNumber}
          isPending={quote.isPending}
          isApproved={quote.isApproved}
          isCancelled={quote.isCancelled}
        />

        <QuoteStatusBanner isApproved={quote.isApproved} isCancelled={quote.isCancelled} />

        <QuoteCustomerCard
          customerName={order.customer?.name}
          customerPhone={order.customer?.phone}
          deviceBrand={order.device?.brand}
          deviceModel={order.device?.model}
          deviceColor={order.device?.color}
        />

        <QuoteDiagnosticCard
          reportedDefect={order.reportedDefect}
          technicalReport={order.technicalReport}
        />

        <QuoteChecklistCard
          items={checklistItems}
          batteryHealth={checklist.batteryHealth}
          casingCondition={checklist.casingCondition}
          cosmeticPhotos={checklist.cosmeticPhotos}
        />

        <QuoteItemsCard
          items={order.items ?? []}
          totalPartsPrice={order.totalPartsPrice}
          totalLaborPrice={order.totalLaborPrice}
          totalDiscount={order.totalDiscount}
          grandTotal={order.grandTotal}
        />

        {quote.isPending && (
          <QuoteActionBar
            grandTotal={order.grandTotal}
            onApprove={quote.openApproveModal}
            onReject={quote.openRejectModal}
          />
        )}

        <div className="text-center text-[11px] text-muted-foreground pb-6">
          Reparô • Assistência Técnica e Gestão Especializada
        </div>
      </div>

      <QuoteApproveModal
        open={quote.showApproveModal}
        onClose={quote.closeModal}
        grandTotal={order.grandTotal}
        customerName={order.customer?.name}
        signature={quote.customerSignature}
        onSignatureChange={quote.setCustomerSignature}
        onConfirm={quote.approve}
        isPending={quote.isApproving}
        error={quote.approveError}
      />

      <QuoteRejectModal
        open={quote.showRejectModal}
        onClose={quote.closeModal}
        reason={quote.rejectionReason}
        onReasonChange={quote.setRejectionReason}
        onConfirm={quote.reject}
        isPending={quote.isRejecting}
        error={quote.rejectError}
      />
    </div>
  );
}
