"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@fluxos/contracts";
import { LoginFormValues } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message || "Credenciais inválidas. Verifique seu e-mail e senha.";
        throw new Error(errorMessage);
      }

      const data = await res.json();
      localStorage.setItem("fluxos_token", data.accessToken);
      localStorage.setItem("fluxos_user", JSON.stringify(data.user));
      document.cookie = `fluxos_token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao acessar. Tente novamente.");
      }
    }
  };

  const setFastCredentials = (email: string, pass: string) => {
    form.setValue("email", email);
    form.setValue("password", pass);
  };

  return {
    form,
    error,
    isLoading: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    setFastCredentials,
  };
}
