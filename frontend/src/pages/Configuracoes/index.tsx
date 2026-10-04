import { useTheme } from "next-themes";
import {
  CircleUserRound,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/components/ui/ApiError";
export default function ConfiguracoesPage() {
  const profile = useQuery({ queryKey: ["perfil"], queryFn: userService.me });
  const permissions = usePermissions();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="qt-heading">
        {profile.data
          ? `Oi, ${profile.data.name.split(" ")[0]}.`
          : "Minha conta."}
      </h1>
      <p className="qt-muted mt-3 mb-7">Tudo pronto para sua próxima compra.</p>
      {profile.isPending ? (
        <p role="status">Carregando sua conta…</p>
      ) : profile.isError ? (
        <ApiError onRetry={() => void profile.refetch()} />
      ) : (
        <section className="qt-panel flex items-center gap-5">
          <CircleUserRound className="size-11 shrink-0 text-brand-600" />
          <div className="min-w-0">
            <h2 className="text-xl font-bold">{profile.data?.name}</h2>
            <p className="qt-muted break-all">{profile.data?.email}</p>
          </div>
        </section>
      )}
      <section className="qt-collection mt-6">
        <img src="/images/hero-market.png" alt="" />
        <div>
          <h2 className="text-2xl font-bold">Minhas listas</h2>
          <p className="mt-3 leading-6">
            Organize o que precisa e descubra novos produtos para a sua casa.
          </p>
          <Link to="/lista" className="qt-action mt-5">
            Ver minhas listas
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <section className="qt-panel mt-6">
        <h2 className="text-xl font-bold">Do seu jeito</h2>
        <p className="qt-muted mt-2">Escolha o tema que combina com você.</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Claro", icon: Sun },
            { value: "dark", label: "Escuro", icon: Moon },
            { value: "system", label: "Sistema", icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              aria-pressed={theme === value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 rounded-xl border py-4 text-sm ${theme === value ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-700/30 dark:text-brand-100" : ""}`}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </div>
      </section>
      {permissions.isError && (
        <ApiError onRetry={() => void permissions.refetch()} />
      )}
      {permissions.data?.gerenciarPrecos && (
        <section className="qt-panel mt-6">
          <h2 className="text-xl font-bold">Seu espaço de gestão</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/precos" className="qt-secondary">
              Ofertas e preços
            </Link>
            <Link to="/catalogo?aba=mercados" className="qt-secondary">
              Mercados
            </Link>
            {permissions.data.gerenciarUsuarios && (
              <>
                <Link to="/usuarios" className="qt-secondary">
                  Usuários
                </Link>
                <Link to="/vitrine" className="qt-secondary">
                  Vitrine
                </Link>
              </>
            )}
          </div>
        </section>
      )}
      <button
        className="qt-panel mt-6 flex w-full items-center gap-3 !py-5 text-red-600 dark:text-red-300"
        onClick={() => {
          logout();
          navigate("/", { replace: true });
        }}
      >
        <LogOut className="size-5" />
        Sair da conta
      </button>
    </div>
  );
}
