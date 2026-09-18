import React from "react";

export interface TextActionsGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function TextActionsGroup({
  children,
  className = "",
}: TextActionsGroupProps) {
  return (
    <div
      className={`inline-flex items-center justify-end gap-3 text-right ${className}`.trim()}
    >
      {children}
    </div>
  );
}
