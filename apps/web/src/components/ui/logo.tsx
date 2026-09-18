import React from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "dark" | "white";
  showBadge?: boolean;
};

export const Logo = ({ className, variant = "dark", showBadge = false }: LogoProps) => {
  const isWhite = variant === "white";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Icon mark */}
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-[10px] font-bold text-[18px] transition-transform",
          isWhite
            ? "bg-white text-[#1c2b33] shadow-sm"
            : "bg-[#00875a] text-white shadow-sm"
        )}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v4" />
          <path d="m4.93 4.93 2.83 2.83" />
          <path d="M2 12h4" />
          <path d="m4.93 19.07 2.83-2.83" />
          <path d="M12 22v-4" />
          <path d="m19.07 19.07-2.83-2.83" />
          <path d="M22 12h-4" />
          <path d="m19.07 4.93-2.83 2.83" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[21px] font-bold tracking-tight",
            isWhite ? "text-white" : "text-[#1c2b33]"
          )}
          style={{ fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif" }}
        >
          Repar<span className={isWhite ? "text-emerald-300" : "text-[#00875a]"}>ô</span>
        </span>
        {showBadge && (
          <span
            className={cn(
              "text-[10px] tracking-wider uppercase font-semibold mt-0.5",
              isWhite ? "text-white/60" : "text-[#465a69]"
            )}
          >
            SaaS de Bancada
          </span>
        )}
      </div>
    </div>
  );
};
