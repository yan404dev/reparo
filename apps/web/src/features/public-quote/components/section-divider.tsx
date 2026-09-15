import React from "react";

interface SectionDividerProps {
  icon: React.ElementType;
  title: string;
}

export function SectionDivider({ icon: Icon, title }: SectionDividerProps) {
  return (
    <div className="relative flex items-center justify-center py-1">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex items-center gap-2 bg-white px-4">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm font-semibold tracking-tight text-foreground whitespace-nowrap">
          {title}
        </span>
      </div>
    </div>
  );
}
