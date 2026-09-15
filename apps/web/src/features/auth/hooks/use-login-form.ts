"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@fluxos/contracts";
import { LoginFormValues } from "../types";

export function useLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@fluxos.com",
      password: "admin123",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
      }

      const data = await res.json();
      localStorage.setItem("fluxos_token", data.accessToken);
      localStorage.setItem("fluxos_user", JSON.stringify(data.user));

      router.push("/");
    } catch (err: any) {
      setError(err.message);
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
