import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface FormInputFieldProps {
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
  className?: string;
  uppercase?: boolean;
}

export function FormInputField({
  label,
  placeholder,
  registration,
  error,
  type = "text",
  className = "",
  uppercase = false,
}: FormInputFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`h-9 text-sm ${uppercase ? "uppercase" : ""}`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
