import { z } from "zod";

export const ApprovePublicOrderSchema = z.object({
  customerSignature: z.string().optional(),
});

export const RejectPublicOrderSchema = z.object({
  rejectionReason: z.string().optional(),
});

export const PublicCustomerIntakeSchema = z.object({
  customerName: z.string().min(3, "Nome completo é obrigatório"),
  customerPhone: z.string().min(10, "Telefone / WhatsApp é obrigatório"),
  customerDocument: z.string().optional(),
  customerEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  deviceBrand: z.string().min(2, "Marca do smartphone é obrigatória"),
  deviceModel: z.string().min(2, "Modelo do aparelho é obrigatório"),
  deviceColor: z.string().optional(),
  reportedDefect: z.string().min(5, "Descreva o problema com pelo menos 5 caracteres"),
});

export type ApprovePublicOrderInput = z.infer<typeof ApprovePublicOrderSchema>;
export type RejectPublicOrderInput = z.infer<typeof RejectPublicOrderSchema>;
export type PublicCustomerIntakeInput = z.infer<typeof PublicCustomerIntakeSchema>;
