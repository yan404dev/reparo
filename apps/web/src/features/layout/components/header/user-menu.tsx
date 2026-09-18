"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { LogOut, Settings, Store } from "lucide-react";
import { getInitials } from "@fluxos/contracts";
import { useLayout } from "../../hooks/use-layout";

export function UserMenu() {
  const { user, logout } = useLayout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-0.5 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1c2b33]/20">
        <div className="flex h-9 w-9 select-none items-center justify-center rounded-full bg-[#1c2b33] text-xs font-bold tracking-wider text-white shadow-sm ring-2 ring-white">
          {getInitials(user?.name || user?.storeName)}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5 shadow-lg border-[#DEE3E9]">
        <DropdownMenuLabel className="font-normal px-3 py-2.5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#1c2b33] truncate">
                {user?.name || user?.storeName || "Minha Oficina"}
              </p>
              {user?.role && (
                <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                  {user.role}
                </span>
              )}
            </div>

            <p className="text-xs text-[#606770] truncate">{user?.email}</p>

            {user?.storeName && user.storeName !== user?.name && (
              <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-800">
                <Store className="h-3 w-3 shrink-0" />
                <span className="truncate">{user.storeName}</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 bg-[#DEE3E9]" />

        <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#1c2b33] hover:bg-neutral-100 transition-colors">
          <Settings className="h-3.5 w-3.5 text-[#606770]" />
          <span>Configurações</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-[#DEE3E9]" />

        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
