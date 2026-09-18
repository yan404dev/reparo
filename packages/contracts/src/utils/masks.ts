export function cleanDigits(val: string): string {
  return val ? val.replace(/\D/g, "") : "";
}

export function formatCpfMask(val: string): string {
  const digits = cleanDigits(val).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function formatDocument(doc?: string | null): string {
  if (!doc) return "—";
  const clean = cleanDigits(doc);
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (clean.length === 14) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return doc;
}

export function formatPhoneMask(val: string): string {
  const digits = cleanDigits(val).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function cleanPhoneForWhatsApp(phone: string): string {
  const digits = cleanDigits(phone);
  if (digits.startsWith("55")) {
    return digits;
  }
  if (digits.length >= 10) {
    return `55${digits}`;
  }
  return digits;
}

export function formatCurrencyMask(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === "") return "";
  const numeric = typeof val === "number" ? val : parseFloat(String(val).replace(/\D/g, "")) / 100;
  if (Number.isNaN(numeric)) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
}

export function parseCurrencyToNumber(val: string | number): number {
  if (typeof val === "number") return val;
  const digits = cleanDigits(val);
  if (!digits) return 0;
  return parseFloat(digits) / 100;
}
