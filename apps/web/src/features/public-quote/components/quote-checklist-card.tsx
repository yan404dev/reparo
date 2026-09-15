import React from "react";
import { FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { SectionDivider } from "./section-divider";

const casingConditionLabels: Record<string, string> = {
  PERFEITO: "Perfeito / Sem Marcas",
  BOM: "Bom Estado",
  MARCAS_DE_USO: "Marcas de Uso / Desgaste",
  TRINCADO: "Trincado / Vidro Quebrado",
  AMASSADO: "Amassado / Empenado",
};

interface ChecklistItem {
  label: string;
  issue: boolean;
  val: string;
}

interface QuoteChecklistCardProps {
  items: ChecklistItem[];
  batteryHealth?: number;
  casingCondition?: string;
  cosmeticPhotos?: string[];
}

export function QuoteChecklistCard({
  items,
  batteryHealth,
  casingCondition,
  cosmeticPhotos,
}: QuoteChecklistCardProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5 space-y-4">
        <SectionDivider icon={FileCheck} title="Checklist de Entrada do Aparelho" />
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md border flex items-center justify-between text-xs ${
                  item.issue
                    ? "bg-red-50/70 border-red-200 text-red-700"
                    : "bg-white border-border text-foreground"
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
                {batteryHealth ? `${batteryHealth}%` : "Não informada"}
              </span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div>
              <span className="text-muted-foreground">Estado da Carcaça: </span>
              <span className="font-bold text-foreground">
                {casingConditionLabels[casingCondition ?? ""] || casingCondition || "Bom"}
              </span>
            </div>
          </div>

          {cosmeticPhotos && cosmeticPhotos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Fotos da Entrada:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cosmeticPhotos.map((url, idx) => (
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
        </div>
      </CardContent>
    </Card>
  );
}
