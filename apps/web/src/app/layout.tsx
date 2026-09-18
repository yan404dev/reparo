import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const optimistic = localFont({
  src: "../fonts/optimistic.ttf",
  variable: "--font-optimistic",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reparô · Sistema para Assistência Técnica de Smartphones",
  description: "Plataforma inteligente de gestão de ordens de serviço, checklist fotográfico, estoque de peças e orçamentos interativos com margem garantida.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${optimistic.variable} font-sans`}>
      <body className={`${optimistic.className} font-sans antialiased bg-background text-foreground`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
