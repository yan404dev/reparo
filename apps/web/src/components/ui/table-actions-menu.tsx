"use client";

import React from "react";
import Link from "next/link";
import { MoreHorizontal, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TextAction } from "./text-action";

export interface ActionItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "default" | "brand" | "danger";
  target?: string;
  rel?: string;
}

interface TableActionsMenuProps {
  actions: ActionItem[];
  className?: string;
}

export function TableActionsMenu({ actions, className = "" }: TableActionsMenuProps) {
  if (!actions.length) return null;

  if (actions.length === 1) {
    const act = actions[0];
    return (
      <div className={`inline-flex items-center justify-end ${className}`.trim()}>
        <TextAction {...act} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-end ${className}`.trim()}>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus:outline-none">
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Ações</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {actions.map((act) => {
            const Icon = act.icon;
            const content = (
              <>
                {Icon && <Icon className="w-3.5 h-3.5 mr-2 shrink-0" />}
                <span>{act.label}</span>
              </>
            );

            if (act.href) {
              return (
                <DropdownMenuItem key={act.label} asChild>
                  <Link
                    href={act.href}
                    target={act.target}
                    rel={act.rel}
                    className={`w-full cursor-pointer flex items-center ${
                      act.variant === "danger" ? "text-rose-600 focus:text-rose-700" : ""
                    }`}
                  >
                    {content}
                  </Link>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={act.label}
                onClick={act.onClick}
                className={`cursor-pointer flex items-center ${
                  act.variant === "danger" ? "text-rose-600 focus:text-rose-700" : ""
                }`}
              >
                {content}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
