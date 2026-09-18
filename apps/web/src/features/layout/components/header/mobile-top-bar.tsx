"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { UserMenu } from "./user-menu";

export function MobileTopBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-14 items-center justify-between border-b border-[#DEE3E9] bg-white px-4 md:hidden sticky top-0 z-40">
      {pathname !== "/" && pathname !== "/dashboard" ? (
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-50 text-[#1c2b33] border border-[#DEE3E9] transition-colors active:bg-neutral-100"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : (
        <div className="w-8" />
      )}

      <Link href="/dashboard" className="text-base font-bold tracking-tight text-[#1c2b33]">
        Reparô
      </Link>

      <div className="flex items-center">
        <UserMenu />
      </div>
    </div>
  );
}

export default MobileTopBar;
