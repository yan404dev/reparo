import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { siteContent } from "../constants/site-content";

export const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full" style={{ backgroundColor: "#1c2b33" }}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-16 px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          {/* Left: Brand info */}
          <div>
            <Logo variant="white" showBadge />
            <p
              className="mt-4 max-w-sm text-[14px] leading-relaxed"
              style={{ color: "rgba(255, 255, 255, 0.65)" }}
            >
              {siteContent.description}
            </p>
          </div>

          {/* Right: Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {siteContent.footer.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h3
                  className="text-[13px] font-bold uppercase tracking-wider"
                  style={{ color: "rgba(255, 255, 255, 0.45)" }}
                >
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-[14px] font-medium transition-colors hover:text-[#3db884]"
                        style={{ color: "rgba(255, 255, 255, 0.85)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div
          className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between text-[13px]"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.45)",
          }}
        >
          <p>© {year} {siteContent.name} Technologies. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link
              href="#privacidade"
              className="transition-colors hover:text-white"
              style={{ color: "rgba(255, 255, 255, 0.45)" }}
            >
              Privacidade
            </Link>
            <Link
              href="#termos"
              className="transition-colors hover:text-white"
              style={{ color: "rgba(255, 255, 255, 0.45)" }}
            >
              Termos de Uso
            </Link>
            <Link
              href="/login"
              className="transition-colors hover:text-white"
              style={{ color: "rgba(255, 255, 255, 0.45)" }}
            >
              Acesso Técnico
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
