import React from "react";

export interface StatusTextProps {
  label: string;
  colorClass?: string;
  withDot?: boolean;
  className?: string;
}

export function StatusText({
  label,
  colorClass = "text-neutral-700",
  withDot = true,
  className = "",
}: StatusTextProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${colorClass} ${className}`.trim()}
    >
      {withDot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current shrink-0"
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}
