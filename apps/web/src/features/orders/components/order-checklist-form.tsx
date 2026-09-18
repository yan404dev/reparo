"use client";

import React from "react";
import { DeviceChecklist } from "@fluxos/contracts";
import {
  Smartphone,
  ScanFace,
  Camera,
  Volume2,
  Zap,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderChecklistFormProps {
  checklist: DeviceChecklist;
  readOnly?: boolean;
  onChange?: (updated: DeviceChecklist) => void;
}

export function OrderChecklistForm({
  checklist,
  readOnly = false,
  onChange,
}: OrderChecklistFormProps) {
  const toggle = (field: keyof DeviceChecklist) => {
    if (readOnly || !onChange) return;
    onChange({
      ...checklist,
      [field]: !checklist[field],
    });
  };

  const checklistItems = [
    {
      id: "screenBroken",
      label: "Tela Trincada",
      icon: Smartphone,
      isIssue: checklist.screenBroken,
      valueText: checklist.screenBroken ? "Com Danos" : "Íntegra",
    },
    {
      id: "touchWorks",
      label: "Touch Screen",
      icon: Smartphone,
      isIssue: !checklist.touchWorks,
      valueText: checklist.touchWorks ? "Operacional" : "Falhas / Travando",
    },
    {
      id: "faceIdWorking",
      label: "Biometria / Face ID",
      icon: ScanFace,
      isIssue: !checklist.faceIdWorking,
      valueText: checklist.faceIdWorking ? "Operacional" : "Inoperante",
    },
    {
      id: "camerasOk",
      label: "Câmeras Frontal & Traseira",
      icon: Camera,
      isIssue: !checklist.camerasOk,
      valueText: checklist.camerasOk ? "Foco & Imagem OK" : "Com Falhas",
    },
    {
      id: "audioOk",
      label: "Áudio & Microfones",
      icon: Volume2,
      isIssue: !checklist.audioOk,
      valueText: checklist.audioOk ? "Som Limpo" : "Mudo / Chiando",
    },
    {
      id: "chargePortWorking",
      label: "Conector de Carga",
      icon: Zap,
      isIssue: !checklist.chargePortWorking,
      valueText: checklist.chargePortWorking ? "Carrega Normal" : "Mau Contato",
    },
  ];

  const photos = checklist.cosmeticPhotos?.length
    ? checklist.cosmeticPhotos
    : checklist.photoUrls || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {checklistItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id as keyof DeviceChecklist)}
              className={cn(
                "flex items-center justify-between p-3.5 rounded-lg border transition-all text-sm select-none",
                readOnly ? "cursor-default" : "cursor-pointer active:scale-[0.99]",
                item.isIssue
                  ? "bg-rose-50/60 border-rose-200 text-rose-700"
                  : "bg-white border-border text-foreground hover:border-neutral-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
                    item.isIssue ? "bg-rose-100 text-rose-600" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="font-medium text-sm mt-0.5">{item.valueText}</p>
                </div>
              </div>

              {item.isIssue ? (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {photos.length > 0 && (
        <div className="p-3 bg-white rounded-lg border border-border space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ImageIcon className="w-4 h-4 text-primary" />
            Fotos Cosméticas de Entrada ({photos.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {photos.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-video rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center"
              >
                <img
                  src={url}
                  alt={`Foto ${idx + 1}`}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
