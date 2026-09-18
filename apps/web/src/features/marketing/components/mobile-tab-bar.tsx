import React from "react";
import Link from "next/link";
import { Sparkles, Layers, CheckSquare, HelpCircle, ArrowRight } from "lucide-react";
import { siteContent } from "../constants/site-content";

const tabs = [
  { label: "Recursos", href: "#recursos", Icon: Sparkles },
  { label: "Pilares", href: "#como-funciona", Icon: Layers },
  { label: "Comparativo", href: "#comparativo", Icon: CheckSquare },
  { label: "Dúvidas", href: "#faq", Icon: HelpCircle },
];

/** Mobile bottom bar navigation, app style — visible only on mobile */
export const MobileTabBar = () => (
  <nav
    aria-label="Navegação móvel"
    className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-[#e4e6eb] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
  >
    {tabs.map((tab) => {
      const Icon = tab.Icon;
      return (
        <Link
          key={tab.href}
          href={tab.href}
          className="flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold text-[#606770] transition-colors hover:text-[#00875a]"
        >
          <Icon className="h-5 w-5" />
          {tab.label}
        </Link>
      );
    })}

    <Link
      href={siteContent.cta.header.href}
      className="flex flex-col items-center justify-center gap-1 bg-[#00875a] py-2 text-[10px] font-semibold text-white transition-colors hover:bg-[#00704a]"
    >
      <ArrowRight className="h-5 w-5" />
      Testar
    </Link>
  </nav>
);
