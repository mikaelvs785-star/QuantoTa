import { BarChart3, ChevronLeft, ChevronRight, LayoutDashboard, ListChecks, Package, Settings, Store, Tags } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { TabBar } from "@/components/layout/TabBar";
import { useAuth } from "@/hooks/useAuth";

type Props = { collapsed: boolean; onCollapsedChange: () => void };

export function Sidebar({ collapsed, onCollapsedChange }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const area = isAdmin ? "/admin" : "/cliente";
  const items = isAdmin
    ? [
        { label: "Dashboard", icon: LayoutDashboard, to: `${area}/dashboard` },
        { label: "Produtos", icon: Package, to: `${area}/produtos` },
        { label: "Mercados", icon: Store, to: `${area}/mercados` },
        { label: "Preços", icon: Tags, to: `${area}/precos` },
      ]
    : [
        { label: "Dashboard", icon: LayoutDashboard, to: `${area}/dashboard` },
        { label: "Mercados", icon: Store, to: `${area}/mercados` },
        { label: "Comparador", icon: BarChart3, to: `${area}/comparador` },
        { label: "Lista de compras", icon: ListChecks, to: `${area}/lista` },
      ];

  const mobileItems = isAdmin
    ? items
    : [...items, { label: "Configurações", icon: Settings, to: `${area}/configuracoes` }];

  return (
    <>
      <aside className={cn("hidden lg:flex flex-col border-r bg-white dark:bg-slate-950 lg:sticky lg:top-0 lg:z-10", collapsed ? "w-20" : "w-64")}>
        <div className="flex h-16 items-center justify-between px-4">
          <NavLink to="/" className="flex items-center gap-2 font-black text-brand-600">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white">Q</span>
            {!collapsed && "QuantoTá"}
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800",
                  isActive && "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100"
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-3">
          {!isAdmin && (
            <NavLink
              to={`${area}/configuracoes`}
              className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="size-5 shrink-0" />
              {!collapsed && "Configurações"}
            </NavLink>
          )}

          <Button variant="ghost" className="mt-2 w-full" onClick={onCollapsedChange}>
            {collapsed ? <ChevronRight className="size-5" /> : <><ChevronLeft className="size-5" /> Recolher</>}
          </Button>
        </div>
      </aside>

      <TabBar items={mobileItems} />
    </>
  );
}
