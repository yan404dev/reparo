import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type CtaButtonProps = {
  href?: string;
  variant?: "primary" | "outline" | "secondary" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export const CtaButton = ({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
  type = "button",
  disabled = false,
}: CtaButtonProps) => {
  const sizeClasses = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-6 text-[14px]",
    lg: "h-12 px-7 text-[15px]",
  }[size];

  const variantClasses = {
    primary:
      "bg-[#00875a] text-white hover:bg-[#00704a] active:bg-[#00593b] shadow-sm",
    outline:
      "border border-white/90 bg-transparent text-white hover:bg-white hover:text-[#1c2b33]",
    secondary:
      "border border-[#dee3e9] bg-white text-[#1c2b33] hover:bg-[#f5f6f7] hover:border-[#ccd0d5] shadow-xs",
    dark:
      "bg-[#1c2b33] text-white hover:bg-black active:bg-neutral-900 shadow-sm",
    ghost:
      "text-[#1c2b33] hover:bg-[#f0f2f5] hover:text-[#00875a]",
  }[variant];

  const commonClasses = cn(
    "inline-flex items-center justify-center gap-2 select-none whitespace-nowrap rounded-full font-semibold transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    sizeClasses,
    variantClasses,
    className
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("//");
    return (
      <Link
        href={href}
        className={commonClasses}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={commonClasses}
    >
      {children}
    </button>
  );
};
