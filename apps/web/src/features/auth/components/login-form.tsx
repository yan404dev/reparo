"use client";

import React from "react";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useLoginForm } from "../hooks/use-login-form";

export function LoginForm() {
  const { form, error, isLoading, onSubmit, setFastCredentials } = useLoginForm();
  const { register, formState: { errors } } = form;

  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-neutral-900 text-white font-bold text-lg shadow-sm mb-3">
          R
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Reparô</h1>
        <p className="text-xs text-neutral-500 mt-1">Gestão inteligente de assistência e estoque de smartphones</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/80 p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)]">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register("email")}
                placeholder="nome@empresa.com"
                className="w-full bg-neutral-50/60 border border-neutral-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
              />
            </div>
            {errors.email && (
              <span className="text-[11px] text-rose-600 mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full bg-neutral-50/60 border border-neutral-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
              />
            </div>
            {errors.password && (
              <span className="text-[11px] text-rose-600 mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            <span>{isLoading ? "Validando..." : "Entrar na plataforma"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-100">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 text-center">
            Acesso Rápido de Demonstração
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFastCredentials("admin@fluxos.com", "admin123")}
              className="py-1.5 px-2 text-[11px] border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-700 font-medium transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setFastCredentials("carlos@fluxos.com", "admin123")}
              className="py-1.5 px-2 text-[11px] border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-700 font-medium transition-colors"
            >
              Técnico
            </button>
            <button
              type="button"
              onClick={() => setFastCredentials("marina@fluxos.com", "admin123")}
              className="py-1.5 px-2 text-[11px] border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-700 font-medium transition-colors"
            >
              Atendente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
