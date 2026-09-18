import React from "react";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui";
import { PublicNavbar } from "@/features/public-intake/components/public-navbar";
import { PublicIntakeForm } from "@/features/public-intake/components/public-intake-form";

export const metadata: Metadata = {
  title: "Solicitar Orçamento Online · Reparô",
  description: "Descreva o problema do seu smartphone e envie as informações diretamente para a nossa bancada técnica.",
};

export default function PublicIntakePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 px-4 py-6 md:px-7 md:py-8">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Solicitar Orçamento Online
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Preencha os dados do seu smartphone e o defeito relatado para a nossa equipe técnica realizar a pré-avaliação.
            </p>
          </div>

          <Card className="shadow-none">
            <CardContent className="p-6 md:p-8">
              <PublicIntakeForm />
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-[#DEE3E9] bg-white py-4 text-center text-xs text-muted-foreground">
        Reparô · Plataforma de Gestão para Assistência Técnica de Smartphones
      </footer>
    </div>
  );
}

