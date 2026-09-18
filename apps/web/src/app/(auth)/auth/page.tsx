import React from "react";
import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Autenticação · Reparô",
  description: "Acesse a bancada técnica ou crie a oficina da sua assistência no Reparô.",
};

type AuthPageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const resolvedParams = await searchParams;
  const isRegister = resolvedParams?.mode === "register";

  return (
    <AuthSplitLayout>
      {isRegister ? <RegisterForm /> : <LoginForm />}
    </AuthSplitLayout>
  );
}
