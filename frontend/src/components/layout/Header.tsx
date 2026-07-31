import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { useAuth } from "@/hooks/useAuth";

type Props = { onMenuClick: () => void };

export function Header({ onMenuClick }: Props) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-white/90 px-4 backdrop-blur dark:bg-slate-950/90 sm:px-6"><Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Abrir menu"><Menu className="size-5" /></Button><Link to="/" className="hidden text-xl font-black tracking-tight text-brand-600 sm:block">QuantoTá</Link><SearchBar className="mx-auto max-w-xl" placeholder="Busque produtos e mercados" /><Button variant="ghost" size="icon" aria-label="Alternar tema" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}</Button><Button variant="ghost" size="icon" className="relative" aria-label="Notificações"><Bell className="size-5" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500" /></Button><Avatar name={user?.name ?? "Usuário"} src={user?.avatarUrl} /><Button variant="ghost" size="icon" className="hidden sm:inline-flex" onClick={handleLogout} aria-label="Sair"><LogOut className="size-5" /></Button></header>;
}
