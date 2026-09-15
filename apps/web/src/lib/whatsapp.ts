export function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55")) {
    return digits;
  }
  if (digits.length >= 10) {
    return `55${digits}`;
  }
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = cleanPhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function getWhatsAppQuoteUrl(
  customerName: string,
  phone: string,
  deviceModel: string,
  publicToken: string,
  baseUrl?: string
): string {
  const base = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const link = `${base}/orcamento/${publicToken}`;
  const message = `Olá, ${customerName}! O orçamento do seu ${deviceModel} na Reparô está pronto. Você pode conferir os detalhes e aprovar diretamente por este link: ${link}`;
  return buildWhatsAppUrl(phone, message);
}

export function getWhatsAppReadyPickupUrl(
  customerName: string,
  phone: string,
  deviceModel: string,
  grandTotal: number
): string {
  const totalFormatted = grandTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
  const message = `Olá, ${customerName}! Seu ${deviceModel} já está consertado e pronto para retirada na Reparô! Total: ${totalFormatted}. Estamos à disposição!`;
  return buildWhatsAppUrl(phone, message);
}

export function getWhatsAppDelayedPickupUrl(
  customerName: string,
  phone: string,
  deviceModel: string
): string {
  const message = `Olá, ${customerName}! Notamos que seu ${deviceModel} está pronto para retirada há alguns dias. Estamos guardando seu aparelho com total cuidado e segurança. Quando puder passar para retirar?`;
  return buildWhatsAppUrl(phone, message);
}

export function checkDelayedPickup(readyAt?: string | null, updatedAt?: string): {
  isOverdue: boolean;
  hoursElapsed: number;
  daysElapsed: number;
} {
  const timestamp = readyAt || updatedAt;
  if (!timestamp) {
    return { isOverdue: false, hoursElapsed: 0, daysElapsed: 0 };
  }

  const readyTime = new Date(timestamp).getTime();
  const now = new Date().getTime();
  const diffMs = Math.max(0, now - readyTime);
  const hoursElapsed = Math.floor(diffMs / (1000 * 60 * 60));
  const daysElapsed = Math.floor(hoursElapsed / 24);

  return {
    isOverdue: hoursElapsed >= 48,
    hoursElapsed,
    daysElapsed
  };
}
