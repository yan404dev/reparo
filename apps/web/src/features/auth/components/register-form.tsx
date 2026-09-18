"use client";

import React from "react";
import Link from "next/link";
import { Store, User, Phone, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useRegisterForm } from "../hooks/use-register-form";

export function RegisterForm() {
  const { form, error, isLoading, onSubmit } = useRegisterForm();
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
          Crie sua oficina
        </h1>
        <p className="mt-2 text-sm text-[#606770]">
          Sem burocracia e sem cartão de crédito. Configure sua bancada em 2 minutos e comece seu teste grátis.
        </p>
      </div>

      {/* Alerta de Erro */}
      {error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulário de Cadastro */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nome da Oficina / Assistência */}
        <div>
          <label
            htmlFor="shopName"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#465A69]"
          >
            Nome da Oficina / Assistência
          </label>
          <div className="relative">
            <Store className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D949E]" />
            <input
              id="shopName"
              type="text"
              {...register("shopName")}
              placeholder="Ex.: FixTech Laboratório"
              className="w-full rounded-xl border border-[#DEE3E9] bg-white py-3 pl-10 pr-4 text-sm text-[#1c2b33] placeholder:text-[#8D9CA7] transition-all focus:border-[#1c2b33] focus:outline-none focus:ring-2 focus:ring-[#1c2b33]/10"
            />
          </div>
          {errors.shopName && (
            <span className="mt-1 block text-xs text-rose-600">
              {errors.shopName.message}
            </span>
          )}
        </div>

        {/* Linha dupla: Nome do Responsável + WhatsApp */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nome do Responsável */}
          <div>
            <label
              htmlFor="ownerName"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#465A69]"
            >
              Nome do Responsável
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D949E]" />
              <input
                id="ownerName"
                type="text"
                {...register("ownerName")}
                placeholder="Carlos Silva"
                className="w-full rounded-xl border border-[#DEE3E9] bg-white py-3 pl-10 pr-3.5 text-sm text-[#1c2b33] placeholder:text-[#8D9CA7] transition-all focus:border-[#1c2b33] focus:outline-none focus:ring-2 focus:ring-[#1c2b33]/10"
              />
            </div>
            {errors.ownerName && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.ownerName.message}
              </span>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#465A69]"
            >
              WhatsApp
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D949E]" />
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border border-[#DEE3E9] bg-white py-3 pl-10 pr-3.5 text-sm text-[#1c2b33] placeholder:text-[#8D9CA7] transition-all focus:border-[#1c2b33] focus:outline-none focus:ring-2 focus:ring-[#1c2b33]/10"
              />
            </div>
            {errors.phone && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#465A69]"
          >
            E-mail
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D949E]" />
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="contato@suaoficina.com"
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
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#465A69]"
          >
            Senha
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D949E]" />
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Mínimo 6 caracteres"
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
              <span>Criando oficina...</span>
            </>
          ) : (
            <>
              <span>Criar oficina</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Alternância Unificada no Rodapé - Colada no Botão */}
      <div className="mt-3.5 text-center text-xs text-[#606770]">
        <span>Já possui conta? </span>
        <Link
          href="/auth?mode=login"
          className="font-semibold text-[#1c2b33] hover:underline"
        >
          Fazer login
        </Link>
      </div>
    </div>
  );
}
