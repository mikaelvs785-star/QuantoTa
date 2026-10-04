import { Moon, Sun, CircleUserRound, Leaf } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useAuth();
  const { data: p } = usePermissions();
  return (
    <header className="qt-header">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center text-2xl font-extrabold tracking-tight text-brand-700 dark:text-brand-100"
        >
          QuantoTá
          <Leaf aria-hidden="true" className="ml-1 size-5 text-orange-500" />
        </Link>
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-2 lg:flex"
        >
          {[
            ["/", "Início"],
            ["/explorar", "Explorar"],
            ["/lista", "Minha lista"],
            ["/conta", "Conta"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? "bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-100" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {p?.gerenciarPrecos && (
            <Link
              to="/precos"
              className="hidden text-sm font-semibold sm:block"
            >
              Gestão
            </Link>
          )}
          <button
            className="grid size-11 place-items-center rounded-full hover:bg-brand-50 dark:hover:bg-slate-800"
            aria-label="Alternar tema"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </button>
          <Link
            to={user ? "/conta" : "/login"}
            className="flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-semibold"
          >
            <CircleUserRound className="size-5" />
            <span className="hidden sm:inline">
              {user ? user.name.split(" ")[0] : "Entrar"}
            </span>
            <span className="sr-only sm:hidden">
              {user ? "Minha conta" : "Entrar"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
