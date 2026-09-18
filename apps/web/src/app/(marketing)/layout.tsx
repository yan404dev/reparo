import React from "react";
import { SiteHeader } from "@/features/marketing/components/site-header";
import { SiteFooter } from "@/features/marketing/components/site-footer";
import { MobileTabBar } from "@/features/marketing/components/mobile-tab-bar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <div aria-hidden className="h-[calc(3.75rem+env(safe-area-inset-bottom))] lg:hidden" />
      <MobileTabBar />
    </div>
  );
}
