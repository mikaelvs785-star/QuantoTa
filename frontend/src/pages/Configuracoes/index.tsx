import { useTheme } from "next-themes";
import {
  CircleUserRound,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ArrowRight,
  Sparkles,
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
    <div className="w-full">
      {profile.isPending ? (
        <p role="status" className="py-10 text-center text-sm text-slate-500">
          Carregando sua conta…
        </p>
      ) : profile.isError ? (
        <ApiError onRetry={() => void profile.refetch()} />
      ) : (
        <section className="relative overflow-hidden rounded-[30px] bg-brand-700 px-6 py-7 text-white sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-14 -top-16 size-56 rounded-full bg-white/5" />
          <div className="absolute right-28 top-10 size-24 rounded-full bg-orange-400/10" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-full bg-white/12">
                <CircleUserRound className="size-9" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-brand-100/80">
                  SUA CONTA QUANTOTÁ
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-[-.04em] sm:text-4xl">
                  {profile.data
                    ? `Oi, ${profile.data.name.split(" ")[0]}.`
                    : "Minha conta."}
                </h1>
                <p className="mt-2 text-sm text-brand-100/85">
                  Tudo pronto para sua próxima compra.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="font-extrabold">{profile.data?.name}</p>
              <p className="mt-1 break-all text-sm text-brand-100/85">
                {profile.data?.email}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="relative min-h-[310px] overflow-hidden rounded-[30px] bg-[#f2eadc] p-6 text-brand-700 dark:bg-slate-900 dark:text-brand-100 sm:p-8">
          <img
            src="/images/hero-market.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-y-0 right-0 h-full w-[56%] object-cover object-right opacity-45 [mask-image:linear-gradient(to_left,black,transparent)]"
          />
          <div className="relative max-w-md">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-orange-500">
              <Sparkles className="size-4" /> ORGANIZE SUA COMPRA
            </p>
            <h2 className="text-3xl font-black tracking-[-.04em]">
              Minhas listas
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              Organize o que precisa, compare o total e descubra em qual mercado
              sua compra pode sair mais em conta.
            </p>
            <Link
              to="/lista"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff982e] px-5 text-sm font-extrabold text-white transition hover:brightness-95"
            >
              Ver minhas listas
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <section className="rounded-[30px] bg-white p-6 shadow-[0_14px_36px_-28px_rgba(15,83,69,.4)] dark:bg-slate-900 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[.18em] text-brand-600 dark:text-brand-200">
            APARÊNCIA
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-700 dark:text-brand-100">
            Do seu jeito
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Escolha como o QuantoTá aparece para você.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "Claro", icon: Sun },
              { value: "dark", label: "Escuro", icon: Moon },
              { value: "system", label: "Sistema", icon: Monitor },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                aria-pressed={theme === value}
                onClick={() => setTheme(value)}
                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl px-2 text-sm font-bold transition ${
                  theme === value
                    ? "bg-brand-700 text-white shadow-sm"
                    : "bg-[#f8f6f0] text-slate-700 hover:bg-brand-50 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {permissions.isError && (
        <div className="mt-5">
          <ApiError onRetry={() => void permissions.refetch()} />
        </div>
      )}

      {permissions.data?.gerenciarPrecos && (
        <section className="mt-5 rounded-[30px] bg-[#e6f2e8] p-6 dark:bg-brand-700/20 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-brand-600 dark:text-brand-200">
                ÁREA DE GESTÃO
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-700 dark:text-brand-100">
                Seu espaço de gestão
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Acesse rapidamente as ferramentas do seu perfil.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/precos"
                className="rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-100"
              >
                Ofertas e preços
              </Link>
              <Link
                to="/catalogo?aba=mercados"
                className="rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-100"
              >
                Mercados
              </Link>
              {permissions.data.gerenciarUsuarios && (
                <>
                  <Link
                    to="/usuarios"
                    className="rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-100"
                  >
                    Usuários
                  </Link>
                  <Link
                    to="/vitrine"
                    className="rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-100"
                  >
                    Vitrine
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <button
        className="mt-5 flex w-full items-center justify-between rounded-[24px] bg-white px-5 py-4 text-left text-red-600 shadow-[0_10px_30px_-26px_rgba(0,0,0,.35)] transition hover:bg-red-50 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-950/20 sm:px-6"
        onClick={() => {
          logout();
          navigate("/", { replace: true });
        }}
      >
        <span className="flex items-center gap-3 font-extrabold">
          <LogOut className="size-5" />
          Sair da conta
        </span>
        <span className="text-xs font-semibold opacity-70">Encerrar sessão</span>
      </button>
    </div>
  );
}
