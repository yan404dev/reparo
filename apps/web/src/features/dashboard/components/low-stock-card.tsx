"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, AlertTriangle } from "lucide-react";
import { PartDTO } from "@fluxos/contracts";
import { Card, CardContent, Badge } from "@/components/ui";

interface LowStockCardProps {
  parts: PartDTO[];
  isLoading: boolean;
}

export function LowStockCard({ parts, isLoading }: LowStockCardProps) {
  const criticalParts = parts.filter(p => p.stockAvailable <= p.minStockThreshold);

  return (
    <Card className="shadow-none">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold tracking-tight">Monitor de Estoque</h2>
            <Badge variant="warning">{criticalParts.length}</Badge>
          </div>
          <Link
            href="/inventory"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Estoque</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Carregando estoque...</p>
          ) : parts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma peça cadastrada.</p>
          ) : (
            parts.slice(0, 5).map((part) => {
              const isCritical = part.stockAvailable <= part.minStockThreshold;

              return (
                <div
                  key={part.id}
                  className="p-3 rounded-md border border-border bg-background flex items-center justify-between text-sm"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      {isCritical && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                      <p className="font-semibold text-foreground truncate">{part.name}</p>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{part.sku}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-bold tabular-nums text-sm ${
                        isCritical ? "text-amber-600" : "text-foreground"
                      }`}
                    >
                      {part.stockAvailable} disp.
                    </span>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Físico: {part.stockPhysical} | Res: {part.stockReserved}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
