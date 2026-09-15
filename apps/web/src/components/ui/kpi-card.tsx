import * as React from "react";
import { Card, CardContent } from "./card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

export interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  tooltip?: string;
  children?: React.ReactNode;
}

export function KpiCard({ title, value, subtitle, tooltip, children }: KpiCardProps) {
  const card = (
    <Card className="shadow-none h-full">
      <CardContent className="p-3 md:p-5 h-full flex flex-col justify-between gap-1.5 md:gap-3">
        <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
        <p className="text-base md:text-lg font-bold tracking-tight leading-none">{value}</p>
        {subtitle && (
          <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
        )}
        {children}
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{card}</TooltipTrigger>
          <TooltipContent><p>{tooltip}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return card;
}
