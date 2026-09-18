"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { siteContent } from "../constants/site-content";

export const SiteHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{ backgroundColor: "rgb(245, 246, 246)" }}
      className="sticky top-0 z-50 w-full border-b border-[#e4e6eb]"
    >
      <div className="mx-auto flex h-[80px] max-w-[1248px] items-center justify-between px-6 lg:px-8">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" aria-label={siteContent.name} className="flex items-center shrink-0">
            <Logo showBadge />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1">
            {siteContent.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-[15px] font-normal text-[#1c2b33] hover:text-[#00875a] hover:underline hover:underline-offset-4 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link
            href={siteContent.cta.login.href}
            className="hidden sm:inline-flex px-4 py-2 text-[14px] font-medium text-[#1c2b33] hover:text-[#00875a] transition-colors"
          >
            {siteContent.cta.login.label}
          </Link>

          <Link
            href={siteContent.cta.header.href}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#00875a] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#00704a] active:scale-[0.98]"
          >
            {siteContent.cta.header.label}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#1c2b33] hover:bg-[#e4e6eb] transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          style={{ backgroundColor: "rgb(245, 246, 246)" }}
          className="lg:hidden border-t border-[#e4e6eb] px-6 py-5 shadow-lg"
        >
          <nav className="flex flex-col gap-1">
            {siteContent.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-[16px] font-normal text-[#1c2b33] hover:text-[#00875a] border-b border-[#e4e6eb] last:border-0 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href={siteContent.cta.login.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 items-center justify-center rounded-full border border-[#dee3e9] bg-white text-[14px] font-semibold text-[#1c2b33]"
              >
                {siteContent.cta.login.label}
              </Link>
              <Link
                href={siteContent.cta.header.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-12 items-center justify-center rounded-full bg-[#00875a] text-[15px] font-semibold text-white shadow-sm hover:bg-[#00704a]"
              >
                {siteContent.cta.header.label}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
