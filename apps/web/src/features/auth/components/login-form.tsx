"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useLoginForm } from "../hooks/use-login-form";

export function LoginForm() {
  const { form, error, isLoading, onSubmit } = useLoginForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="w-full">
      {/* Cabeçalho Minimalista */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight text-[#1c2b33] sm:text-3xl"
          style={{ fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif" }}
        >
          Entrar no Reparô
        </h1>
        <p className="mt-2 text-sm text-[#606770]">
          Acesse sua bancada técnica, ordens de serviço e estoque.
        </p>
      </div>

      {/* Alerta de Erro */}
      {error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* E-mail */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#465A69]"
          >
            E-mail profissional
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D949E]" />
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="seu.email@assistencia.com"
              className="w-full rounded-xl border border-[#DEE3E9] bg-white py-3 pl-10 pr-4 text-sm text-[#1c2b33] placeholder:text-[#8D9CA7] transition-all focus:border-[#1c2b33] focus:outline-none focus:ring-2 focus:ring-[#1c2b33]/10"
            />
          </div>
          {errors.email && (
            <span className="mt-1 block text-xs text-rose-600">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Senha */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#465A69]"
            >
              Senha
            </label>
            <Link
              href="#recuperar"
              className="text-xs font-medium text-[#606770] hover:text-[#1c2b33] transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D949E]" />
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#DEE3E9] bg-white py-3 pl-10 pr-4 text-sm text-[#1c2b33] placeholder:text-[#8D9CA7] transition-all focus:border-[#1c2b33] focus:outline-none focus:ring-2 focus:ring-[#1c2b33]/10"
            />
          </div>
          {errors.password && (
            <span className="mt-1 block text-xs text-rose-600">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Botão TurmaPay Style */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Acessando bancada...</span>
            </>
          ) : (
            <>
              <span>Entrar</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Alternância Unificada no Rodapé - Colada no Botão */}
      <div className="mt-3.5 text-center text-xs text-[#606770]">
        <span>Não tem uma conta? </span>
        <Link
          href="/auth?mode=register"
          className="font-semibold text-[#1c2b33] hover:underline"
        >
          Criar oficina
        </Link>
      </div>
    </div>
  );
}
