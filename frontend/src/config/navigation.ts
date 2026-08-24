import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  LayoutDashboard,
  ListChecks,
  Package,
  Settings,
  Store,
  Tags,
  Users,
} from "lucide-react";

export type UserRole = "ADMIN" | "USER" | "VENDEDOR";

export interface NavigationItem {
  label: string;
  icon: LucideIcon;
  to: string;
}

export const defaultRouteByRole: Record<UserRole, string> = {
  ADMIN: "/admin/dashboard",
  USER: "/cliente/dashboard",
  VENDEDOR: "/vendedor/dashboard",
};

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
  ADMIN: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/admin/dashboard",
    },
    {
      label: "Produtos",
      icon: Package,
      to: "/admin/produtos",
    },
    {
      label: "Mercados",
      icon: Store,
      to: "/admin/mercados",
    },
    {
      label: "Usuários",
      icon: Users,
      to: "/admin/usuarios",
    },
    {
      label: "Preços",
      icon: Tags,
      to: "/admin/precos",
    },
  ],

  USER: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/cliente/dashboard",
    },
    {
      label: "Mercados",
      icon: Store,
      to: "/cliente/mercados",
    },
    {
      label: "Comparador",
      icon: BarChart3,
      to: "/cliente/comparador",
    },
    {
      label: "Lista de compras",
      icon: ListChecks,
      to: "/cliente/lista",
    },
    {
      label: "Configurações",
      icon: Settings,
      to: "/cliente/configuracoes",
    },
  ],

  VENDEDOR: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/vendedor/dashboard",
    },
    {
      label: "Produtos",
      icon: Package,
      to: "/vendedor/produtos",
    },
    {
      label: "Meu mercado",
      icon: Store,
      to: "/vendedor/mercado",
    },
    {
      label: "Meus preços",
      icon: Tags,
      to: "/vendedor/precos",
    },
    {
      label: "Comparador",
      icon: BarChart3,
      to: "/vendedor/comparador",
    },
    {
      label: "Configurações",
      icon: Settings,
      to: "/vendedor/configuracoes",
    },
  ],
};

export function getNavigationByRole(
  role?: string
): NavigationItem[] {
  if (role === "ADMIN" || role === "USER" || role === "VENDEDOR") {
    return navigationByRole[role];
  }

  return [];
}

export function getDefaultRouteByRole(role?: string): string {
  if (role === "ADMIN" || role === "USER" || role === "VENDEDOR") {
    return defaultRouteByRole[role];
  }

  return "/login";
}