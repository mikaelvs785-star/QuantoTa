import { LogOut, Moon, Sun, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="qt-header">
      <Link to="/" className="qt-logo lg:hidden">
        <span>q.</span>QuantoTá
      </Link>
      <p className="hidden text-sm text-slate-500 lg:block">
        {user?.role === "ADMIN"
          ? "Gestão do catálogo"
          : "Uma compra bem planejada começa aqui."}
      </p>
      <div className="ml-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Alternar tema"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>
        {user ? (
          <>
            <span className="hidden text-sm font-semibold sm:block">
              {user.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sair da conta"
              onClick={() => {
                logout();
                navigate("/", { replace: true });
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link to="/login">
              Entrar <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
