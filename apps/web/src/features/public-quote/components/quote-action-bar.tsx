import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, Button } from "@/components/ui";

interface QuoteActionBarProps {
  grandTotal: number;
  onApprove: () => void;
  onReject: () => void;
}

export function QuoteActionBar({ grandTotal, onApprove, onReject }: QuoteActionBarProps) {
  return (
    <div className="sticky bottom-4 z-40">
      <Card className="shadow-lg border-border">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Total do Orçamento:</p>
            <p className="text-xl font-extrabold text-primary">{formatCurrency(grandTotal)}</p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onReject}
              className="flex-1 sm:flex-initial h-10 text-xs text-muted-foreground hover:text-destructive border-border shadow-none"
            >
              <ThumbsDown className="w-3.5 h-3.5 mr-1.5" />
              Recusar
            </Button>
            <Button
              onClick={onApprove}
              className="flex-1 sm:flex-initial h-10 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-none"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Aprovar Orçamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
