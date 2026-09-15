import { Injectable } from "@nestjs/common";

@Injectable()
export class WhatsAppBuilderService {
  private defaultBaseUrl = process.env.WEB_URL || "http://localhost:3000";

  cleanPhone(phone: string): string {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("55")) {
      return digits;
    }
    if (digits.length >= 10) {
      return `55${digits}`;
    }
    return digits;
  }

  buildWhatsAppUrl(phone: string, message: string): string {
    const cleaned = this.cleanPhone(phone);
    if (!cleaned) return "";
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleaned}?text=${encoded}`;
  }

  buildQuoteUrl(
    customerName: string,
    phone: string,
    deviceModel: string,
    publicToken: string,
    baseUrl?: string
  ): string {
    const base = baseUrl || this.defaultBaseUrl;
    const link = `${base}/orcamento/${publicToken}`;
    const message = `Olá, ${customerName}! O orçamento do seu ${deviceModel} na Reparô está pronto. Você pode conferir os detalhes e aprovar diretamente por este link: ${link}`;
    return this.buildWhatsAppUrl(phone, message);
  }

  buildReadyPickupUrl(
    customerName: string,
    phone: string,
    deviceModel: string,
    grandTotalFormatted: string
  ): string {
    const message = `Olá, ${customerName}! Seu ${deviceModel} já está consertado e pronto para retirada na Reparô! Total: ${grandTotalFormatted}. Estamos à disposição!`;
    return this.buildWhatsAppUrl(phone, message);
  }

  buildDelayedPickupUrl(
    customerName: string,
    phone: string,
    deviceModel: string
  ): string {
    const message = `Olá, ${customerName}! Notamos que seu ${deviceModel} está pronto para retirada há alguns dias. Estamos guardando seu aparelho com total cuidado e segurança. Quando puder passar para retirar?`;
    return this.buildWhatsAppUrl(phone, message);
  }

  buildCustomerContactUrl(customerName: string, phone: string): string {
    const message = `Olá ${customerName}, tudo bem? Entramos em contato da assistência técnica Reparô.`;
    return this.buildWhatsAppUrl(phone, message);
  }

  /**
   * Resolve a URL de WhatsApp mais relevante com base no status da OS
   */
  resolveOrderWhatsAppUrl(
    status: string,
    customerName: string,
    phone: string,
    deviceModel: string,
    publicToken: string,
    grandTotalFormatted: string,
    isLateDelivery: boolean
  ): string | null {
    if (!phone) return null;

    if (status === "PRONTO_RETIRADA") {
      if (isLateDelivery) {
        return this.buildDelayedPickupUrl(customerName, phone, deviceModel);
      }
      return this.buildReadyPickupUrl(customerName, phone, deviceModel, grandTotalFormatted);
    }

    if ((status === "CRIADA" || status === "AGUARDANDO_APROVACAO") && publicToken) {
      return this.buildQuoteUrl(customerName, phone, deviceModel, publicToken);
    }

    return this.buildCustomerContactUrl(customerName, phone);
  }
}
