import { useState } from "react";
import { Ellipsis, type LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type Item = { label: string; icon: LucideIcon; to: string };
export function TabBar({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const primary = items.slice(0, 4);
  const extra = items.slice(4);
  const moreActive = extra.some((i) => location.pathname.startsWith(i.to));
  return (
    <nav
      aria-label="Navegação móvel"
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden"
    >
      {open && extra.length > 0 && (
        <div
          id="mobile-more"
          className="qt-panel absolute bottom-full right-3 mb-3 w-56 shadow-lg"
        >
          {extra.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn("qt-nav-item", isActive && "qt-nav-active")
              }
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
      <div className="mx-auto flex max-w-6xl gap-1 px-2 py-2">
        {primary.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs font-semibold",
                (isActive || (to === "/explorar" && location.pathname === "/comparar"))
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100"
                  : "text-slate-500 dark:text-slate-400",
              )
            }
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </NavLink>
        ))}
        {extra.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-more"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs font-semibold",
              moreActive || open
                ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100"
                : "text-slate-500 dark:text-slate-400",
            )}
          >
            <Ellipsis className="size-5" />
            Mais
          </button>
        )}
      </div>
    </nav>
  );
}
