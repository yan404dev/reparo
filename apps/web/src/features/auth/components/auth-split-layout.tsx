import React from "react";
import { Logo } from "@/components/ui/logo";

type AuthSplitLayoutProps = {
  children: React.ReactNode;
};

export const AuthSplitLayout = ({ children }: AuthSplitLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-[#FAFAFA] text-[#1c2b33]">
      {/* Lado Esquerdo (40% de largura - Desktop Only) */}
      <aside className="relative hidden w-full lg:flex lg:w-[40%] flex-col justify-between overflow-hidden bg-[#0e171b] p-12 xl:p-16 text-white select-none">
        {/* Imagem de fundo imersiva com bancada técnica moderna e iluminação refinada */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=85"
            alt="Bancada técnica moderna Reparô"
            className="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity filter contrast-125"
          />
          {/* Overlay com degradê escurecido sofisticado */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e171b]/90 via-[#0e171b]/60 to-[#0e171b]/95" />
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Topo do Lado Esquerdo: Logo do Reparô */}
        <div className="relative z-10">
          <Logo variant="white" showBadge={false} />
        </div>

        {/* Base do Lado Esquerdo: Frase de Impacto Minimalista */}
        <div className="relative z-10 space-y-3">
          <div className="h-1 w-8 rounded-full bg-emerald-500" />
          <h2
            className="text-2xl xl:text-3xl font-semibold tracking-tight text-white leading-snug"
            style={{ fontFamily: "var(--font-optimistic), var(--font-sans), sans-serif" }}
          >
            A precisão que a sua assistência técnica precisa para escalar.
          </h2>
          <p className="text-sm leading-relaxed text-neutral-400 max-w-sm">
            Checklist, controle de peças, ordens de serviço e orçamentos em uma plataforma desenhada para alta performance.
          </p>
        </div>
      </aside>

      {/* Lado Direito (60% de largura - No-Card) */}
      <main className="flex w-full flex-1 flex-col justify-center bg-[#FAFAFA] p-8 md:p-16 lg:w-[60%] lg:p-24">
        {/* Logo visível apenas no mobile */}
        <div className="mb-8 block lg:hidden">
          <Logo showBadge={false} />
        </div>

        {/* Formulário Solto sem card flutuante */}
        <div className="mx-auto w-full max-w-[620px]">
          {children}
        </div>
      </main>
    </div>
  );
};
