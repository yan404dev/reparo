"use client";

import React from "react";
import { DeviceChecklist, CasingCondition } from "@fluxos/contracts";
import { Smartphone, Battery, ScanFace, Camera, Volume2, Zap, CheckCircle2, XCircle, ShieldAlert, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderChecklistFormProps {
  checklist: DeviceChecklist;
  readOnly?: boolean;
  onChange?: (updated: DeviceChecklist) => void;
}

const CASING_CONDITIONS: { value: CasingCondition; label: string; color: string }[] = [
  { value: "PERFEITO", label: "Perfeito", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "BOM", label: "Bom", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { value: "MARCAS_DE_USO", label: "Marcas de Uso", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "TRINCADO", label: "Trincado", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { value: "AMASSADO", label: "Amassado", color: "text-red-700 bg-red-50 border-red-200" },
];

export function OrderChecklistForm({ checklist, readOnly = false, onChange }: OrderChecklistFormProps) {
  const toggle = (field: keyof DeviceChecklist) => {
    if (readOnly || !onChange) return;
    onChange({
      ...checklist,
      [field]: !checklist[field],
    });
  };

  const handleCasingChange = (condition: CasingCondition) => {
    if (readOnly || !onChange) return;
    onChange({
      ...checklist,
      casingCondition: condition,
    });
  };

  const handleBatteryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || !onChange) return;
    const val = e.target.value === "" ? null : Number(e.target.value);
    onChange({
      ...checklist,
      batteryHealth: val,
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

  const photos = checklist.cosmeticPhotos?.length ? checklist.cosmeticPhotos : checklist.photoUrls || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {checklistItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id as keyof DeviceChecklist)}
              className={cn(
                "flex items-center justify-between p-3 rounded-md border transition-all text-xs select-none",
                readOnly ? "cursor-default" : "cursor-pointer active:scale-[0.99]",
                item.isIssue
                  ? "bg-red-50/70 border-red-200 text-destructive"
                  : "bg-white border-border text-foreground hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                    item.isIssue ? "bg-red-100 text-destructive" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">{item.label}</p>
                  <p className="font-semibold text-xs mt-0.5">{item.valueText}</p>
                </div>
              </div>

              {item.isIssue ? (
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">Saúde da Bateria:</span>
            {readOnly ? (
              <span className="text-xs font-bold tabular-nums">
                {checklist.batteryHealth ? `${checklist.batteryHealth}%` : "Não verificada"}
              </span>
            ) : (
              <input
                type="number"
                min="0"
                max="100"
                value={checklist.batteryHealth ?? ""}
                onChange={handleBatteryChange}
                placeholder="Ex: 85"
                className="w-20 h-8 px-2 rounded-md border border-input text-xs bg-white"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">Estado da Carcaça:</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CASING_CONDITIONS.map((cond) => {
            const isSelected = checklist.casingCondition === cond.value;
            return (
              <button
                key={cond.value}
                type="button"
                disabled={readOnly}
                onClick={() => handleCasingChange(cond.value)}
                className={cn(
                  "h-8 px-3 rounded-md text-xs font-medium border transition-all",
                  isSelected
                    ? `${cond.color} font-bold shadow-xs ring-1 ring-offset-1`
                    : "bg-white text-muted-foreground border-border hover:bg-gray-50"
                )}
              >
                {cond.label}
              </button>
            );
          })}
        </div>
      </div>

      {photos.length > 0 && (
        <div className="p-3 bg-white rounded-lg border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
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
                <img src={url} alt={`Foto ${idx + 1}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
