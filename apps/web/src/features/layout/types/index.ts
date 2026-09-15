import React from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeVariant?: "default" | "warning" | "success";
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}
