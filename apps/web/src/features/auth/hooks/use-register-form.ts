"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema, RegisterFormValues } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      shopName: "",
      ownerName: "",
      phone: "",
      email: "",
      password: "",
      terms: true,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.ownerName,
          email: values.email,
          password: values.password,
          storeName: values.shopName,
          shopName: values.shopName,
          phone: values.phone,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message || "Erro ao criar conta. Verifique os dados.";
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
        setError("Ocorreu um erro ao processar seu cadastro.");
      }
    }
  };

  return {
    form,
    error,
    isLoading: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
