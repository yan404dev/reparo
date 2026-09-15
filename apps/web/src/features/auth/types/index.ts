import { LoginInput } from "@fluxos/contracts";

export type LoginFormValues = LoginInput;

export interface AuthState {
  id: string;
  name: string;
  email: string;
  role: string;
}
