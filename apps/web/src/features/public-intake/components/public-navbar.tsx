import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#DEE3E9] bg-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#465a69] bg-neutral-100 px-3 py-1 rounded-full border border-[#DEE3E9]">
            Autoatendimento
          </span>
        </div>
      </div>
    </header>
  );
}

