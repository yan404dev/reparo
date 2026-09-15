import React from "react";
import { Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { SectionDivider } from "./section-divider";

interface QuoteDiagnosticCardProps {
  reportedDefect: string;
  technicalReport?: string;
}

export function QuoteDiagnosticCard({ reportedDefect, technicalReport }: QuoteDiagnosticCardProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5 space-y-4">
        <SectionDivider icon={Wrench} title="Diagnóstico & Laudo Técnico" />
        <div className="space-y-3 text-xs">
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Defeito Informado pelo Cliente:</p>
            <p className="text-foreground bg-muted/40 p-2.5 rounded-md border border-border">
              {reportedDefect}
            </p>
          </div>
          {technicalReport && (
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Parecer Técnico da Bancada:</p>
              <p className="text-blue-900 bg-blue-50/50 p-2.5 rounded-md border border-blue-100">
                {technicalReport}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
