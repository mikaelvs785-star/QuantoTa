import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListChecks,
  Package,
  Settings,
  Store,
  Tags,
  Users,
  Search,
} from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { TabBar } from "./TabBar";
import { useAuth } from "@/hooks/useAuth";
export function Sidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: () => void;
}) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const admin = pathname.startsWith("/admin");
  const items = admin
    ? [
        { label: "Visão geral", icon: LayoutDashboard, to: "/admin/dashboard" },
        { label: "Produtos", icon: Package, to: "/admin/produtos" },
        { label: "Mercados", icon: Store, to: "/admin/mercados" },
        { label: "Preços", icon: Tags, to: "/admin/precos" },
        { label: "Usuários", icon: Users, to: "/admin/usuarios" },
      ]
    : [
        { label: "Início", icon: LayoutDashboard, to: "/cliente/dashboard" },
        { label: "Comparar preços", icon: Search, to: "/comparar" },
        { label: "Minha lista", icon: ListChecks, to: "/cliente/lista" },
        { label: "Mercados", icon: Store, to: "/mercados" },
        { label: "Minha conta", icon: Settings, to: "/cliente/configuracoes" },
      ];
  return (
    <>
      <aside className={cn("qt-sidebar", collapsed && "qt-sidebar-small")}>
        <Link to="/" className="qt-logo">
          <span>q.</span>
          {!collapsed && "QuantoTá"}
        </Link>
        {!collapsed && (
          <p className="qt-eyebrow mt-10 mb-4">
            {admin ? "ADMINISTRAÇÃO" : "SUA COMPRA"}
          </p>
        )}
        <nav aria-label="Menu principal" className="mt-4 space-y-2">
          {items.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                cn("qt-nav-item", isActive && "qt-nav-active")
              }
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          {!collapsed && (
            <div className="qt-sidebar-tip">
              <ListChecks className="mb-3 size-6" />
              <p className="font-semibold">Planeje antes de comprar.</p>
              <p className="mt-2 text-xs leading-5">
                Compare o mesmo produto e confira a data de cada preço.
              </p>
            </div>
          )}
          {!admin && user?.role === "ADMIN" && (
            <Link to="/admin/dashboard" className="qt-nav-item mt-3">
              <LayoutDashboard className="size-4" />
              {!collapsed && "Administração"}
            </Link>
          )}
          {admin && (
            <Link to="/comparar" className="qt-nav-item mt-3">
              <ArrowLeft className="size-4" />
              {!collapsed && "Ver como consumidor"}
            </Link>
          )}
          <Button
            variant="ghost"
            className="mt-4 w-full"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            onClick={onCollapsedChange}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <>
                <ChevronLeft className="size-4" />
                Recolher
              </>
            )}
          </Button>
        </div>
      </aside>
      <TabBar
        items={items.map((i) => ({
          ...i,
          label:
            i.label === "Comparar preços"
              ? "Comparar"
              : i.label === "Minha lista"
                ? "Lista"
                : i.label === "Minha conta"
                  ? "Conta"
                  : i.label,
        }))}
      />
    </>
  );
}
