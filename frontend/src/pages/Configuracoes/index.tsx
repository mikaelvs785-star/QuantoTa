import { useTheme } from "next-themes";
import { UserRound, Sun, Moon, Monitor } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SectionTitle } from "@/components/ui/SectionTitle";
export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  return (
    <div className="mx-auto max-w-4xl">
      <SectionTitle
        title="Minha conta."
        description="Confira seus dados e escolha como prefere visualizar o QuantoTá."
      />
      <section className="qt-panel">
        <UserRound className="size-7 text-brand-600" />
        <h2 className="mt-4 text-xl font-semibold">Seus dados</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="qt-muted">Nome</dt>
            <dd className="mt-1 font-semibold">{user?.name}</dd>
          </div>
          <div>
            <dt className="qt-muted">E-mail</dt>
            <dd className="mt-1 break-all font-semibold">{user?.email}</dd>
          </div>
        </dl>
      </section>
      <section className="qt-panel mt-6">
        <h2 className="text-xl font-semibold">Aparência</h2>
        <p className="qt-muted mt-2">
          Sua preferência fica salva neste navegador.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { value: "light", label: "Claro", icon: Sun },
            { value: "dark", label: "Escuro", icon: Moon },
            { value: "system", label: "Usar sistema", icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              aria-pressed={theme === value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${theme === value ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : ""}`}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
