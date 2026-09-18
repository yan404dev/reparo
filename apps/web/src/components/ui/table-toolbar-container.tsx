import React from "react";

export interface TableToolbarContainerProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

export function TableToolbarContainer({
  left,
  right,
  className = "",
}: TableToolbarContainerProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full mb-4 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center gap-3">{left}</div>
      <div className="flex items-center justify-end gap-2 shrink-0">{right}</div>
    </div>
  );
}
