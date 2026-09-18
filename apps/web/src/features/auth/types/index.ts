import { z } from "zod";
import { LoginInput } from "@fluxos/contracts";

export type LoginFormValues = LoginInput;

export const RegisterFormSchema = z.object({
  shopName: z.string().min(2, "Nome da assistência deve ter ao menos 2 caracteres"),
  ownerName: z.string().min(2, "Nome do responsável deve ter ao menos 2 caracteres"),
  phone: z.string().min(10, "Informe um WhatsApp comercial válido"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  terms: z.boolean().refine((val) => val === true, {
    message: "Você deve concordar com os termos de uso",
  }),
});

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export interface AuthState {
  id: string;
  name: string;
  email: string;
  role: string;
}
