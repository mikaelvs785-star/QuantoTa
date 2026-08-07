import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type Item = { label: string; icon: LucideIcon; to: string };

type Props = { items: Item[] };

export function TabBar({ items }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-1 px-3 py-2">
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-brand-500",
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
              )
            }
          >
            <Icon className="size-5" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
