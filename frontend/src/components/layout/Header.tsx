import { Bell, ChevronRight, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { useAuth } from "@/hooks/useAuth";

const pageNames: Record<string, string> = {
  "/admin/dashboard": "Administração",
  "/admin/produtos": "Produtos",
  "/admin/mercados": "Mercados",
  "/admin/precos": "Preços",
  "/cliente/dashboard": "Minha área",
  "/cliente/mercados": "Mercados",
  "/cliente/comparador": "Comparador",
  "/cliente/lista": "Lista de compras",
  "/cliente/configuracoes": "Configurações",
};

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageName = pageNames[pathname] ?? "Painel";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-white/90 px-4 backdrop-blur dark:bg-slate-950/90 sm:px-6">
      <Link to="/" className="hidden text-xl font-black tracking-tight text-brand-600 xl:block">
        QuantoTá
      </Link>

      <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-sm text-slate-500 xl:flex">
        <ChevronRight className="size-4" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">{pageName}</span>
      </nav>

      <SearchBar className="mx-auto max-w-xl" placeholder="Busque produtos e mercados" />

      <Button
        variant="ghost"
        size="icon"
        aria-label="Alternar tema"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>

      <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
        <Bell className="size-5" />
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500" />
      </Button>

      <details className="relative">
        <summary className="list-none cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
          <Avatar name={user?.name ?? "Usuário"} src={user?.avatarUrl} />
        </summary>

        <div className="absolute right-0 mt-2 w-52 rounded-xl border bg-white p-2 shadow-lg dark:bg-slate-900">
          <p className="truncate px-3 py-2 text-sm font-semibold">{user?.name ?? "Usuário"}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-brand-500 dark:hover:bg-red-500/10"
          >
            <LogOut className="size-4" /> Sair
          </button>
        </div>
      </details>
    </header>
  );
}
