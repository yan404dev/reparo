import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  label?: string;
  className?: string;
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  if (!label) {
    return <hr className={cn("border-t border-border my-5", className)} />;
  }

  return (
    <div className={cn("relative flex items-center py-3 my-2", className)}>
      <div className="flex-grow border-t border-border" />
      <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex-grow border-t border-border" />
    </div>
  );
}
