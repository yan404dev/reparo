import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { formatCurrency, formatDate, formatShortDate, formatCpfMask, formatPhoneMask, formatDocument } from "@fluxos/contracts";
