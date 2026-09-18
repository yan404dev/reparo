import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface TextActionProps {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "default" | "brand" | "danger";
  target?: string;
  rel?: string;
  title?: string;
}

const VARIANT_STYLES = {
  default: "text-neutral-600 hover:text-neutral-950",
  brand: "text-primary hover:text-primary/80",
  danger: "text-rose-600 hover:text-rose-800",
};

export function TextAction({
  label,
  href,
  onClick,
  icon: Icon,
  variant = "default",
  target,
  rel,
  title,
}: TextActionProps) {
  const baseClasses =
    `inline-flex items-center gap-1 text-xs font-medium transition-colors ${VARIANT_STYLES[variant]}`;

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        title={title}
        className={baseClasses}
      >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={baseClasses}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
}
