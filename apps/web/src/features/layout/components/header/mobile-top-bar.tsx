"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function MobileTopBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 flex h-12 items-center justify-between bg-background px-4 md:hidden border-b border-border">
      {pathname !== "/" ? (
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-foreground border border-border transition-colors active:bg-gray-100"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
      ) : (
        <div className="w-8" />
      )}

      <Link href="/" className="text-base font-bold tracking-tight">
        Reparô
      </Link>

      <div className="w-8" />
    </div>
  );
}
export default MobileTopBar;
