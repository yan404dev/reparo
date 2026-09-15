import {
  LayoutDashboard,
  Wrench,
  Boxes,
  Smartphone,
  Users,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Ordens de Serviço", icon: Wrench },
  { href: "/inventory", label: "Estoque & Peças", icon: Boxes },
  { href: "/devices", label: "Aparelhos", icon: Smartphone },
  { href: "/customers", label: "Clientes", icon: Users },
] as const;

export const BOTTOM_NAV_ITEMS = NAV_ITEMS.slice(0, 4);
export const DRAWER_NAV_ITEMS = NAV_ITEMS.slice(4);
