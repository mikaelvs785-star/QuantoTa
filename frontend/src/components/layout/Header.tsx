import { Bell, CheckCheck, ChevronRight, LogOut, Moon, ShoppingBasket, Store, TrendingDown, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { useAuth } from "@/hooks/useAuth";

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: "price" | "market" | "product";
  href: string;
}

const initialNotifications: NotificationItem[] = [
  { id: 1, title: "Preço do arroz caiu", description: "Supermercado Central está 12% mais barato hoje.", time: "10 min atrás", unread: true, type: "price", href: "/cliente/dashboard" },
  { id: 2, title: "Mercado atualizado", description: "Novo catálogo disponível em Mercado Viva.", time: "1 hora atrás", unread: true, type: "market", href: "/cliente/mercados" },
  { id: 3, title: "Produto em destaque", description: "Leite Integral entrou na lista de melhores ofertas.", time: "Hoje", unread: false, type: "product", href: "/cliente/lista" },
  { id: 4, title: "Comparação concluída", description: "Seu comparador foi atualizado com os últimos preços.", time: "Ontem", unread: false, type: "price", href: "/cliente/comparador" },
];

const notificationTypeStyles: Record<NotificationItem["type"], { icon: typeof TrendingDown; className: string }> = {
  price: { icon: TrendingDown, className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" },
  market: { icon: Store, className: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200" },
  product: { icon: ShoppingBasket, className: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300" },
};

const pageNames: Record<string, string> = {
  "/admin/dashboard": "Administração",
  "/admin/produtos": "Produtos",
  "/admin/mercados": "Mercados",
  "/admin/usuarios": "Usuários",
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
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleNotificationClick(notification: NotificationItem) {
    setNotifications((current) =>
      current.map((item) => (item.id === notification.id ? { ...item, unread: false } : item)),
    );
    setNotificationsOpen(false);
    navigate(notification.href);
  }

  function handleMarkAllAsRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
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

      <div ref={notificationRef} className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notificações"
          aria-expanded={notificationsOpen}
          onClick={() => setNotificationsOpen((value) => !value)}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notificações</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} nova(s)</p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-brand-500/10"
                >
                  <CheckCheck className="size-3.5" />
                  Marcar todas
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <Bell className="size-8 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Você está em dia</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Nenhuma notificação nova por enquanto.</p>
              </div>
            ) : (
              <div className="max-h-[420px] overflow-y-auto p-2">
                {notifications.map((notification) => {
                  const Icon = notificationTypeStyles[notification.type].icon;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:hover:bg-slate-800"
                    >
                      <span className={`mt-0.5 grid size-9 place-items-center rounded-xl ${notificationTypeStyles[notification.type].className}`}>
                        <Icon className="size-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{notification.title}</span>
                          {notification.unread && <span className="size-2 rounded-full bg-brand-600" />}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{notification.description}</span>
                        <span className="mt-2 block text-[11px] font-medium text-slate-400 dark:text-slate-500">{notification.time}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

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
