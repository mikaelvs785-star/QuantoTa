import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  ListChecks,
  Store,
  Moon,
  Sun,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Footer } from "@/components/layout/Footer";
export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <header className="flex min-h-24 flex-wrap items-center justify-between gap-4 py-4">
        <Link to="/" className="qt-logo">
          <span>q.</span>QuantoTá
        </Link>
        <nav
          aria-label="Navegação"
          className="hidden gap-7 text-sm font-semibold md:flex"
        >
          <Link to="/comparar">Comparar preços</Link>
          <Link to="/mercados">Mercados</Link>
          <a href="#como-funciona">Como funciona</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
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
          </Button>
          <Button asChild variant="outline">
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              {isAuthenticated ? "Minha área" : "Entrar"}
            </Link>
          </Button>
        </div>
      </header>
      <main>
        <section className="qt-hero mt-3 grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-200">
              MENOS DÚVIDA. MAIS ECONOMIA.
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-6xl">
              Sua próxima compra
              <br />
              começa com um
              <br />
              <span className="text-[#f9b05b]">bom preço.</span>
            </h1>
            <p className="mt-6 max-w-md leading-7 text-white/75">
              Compare o mesmo produto em diferentes mercados e monte uma lista
              com preços que você pode conferir.
            </p>
            <form
              action="/comparar"
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Input
                name="q"
                aria-label="Produto para comparar"
                placeholder="Qual produto você procura?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 bg-white text-slate-900 dark:bg-white dark:text-slate-900"
              />
              <button className="qt-action" type="submit">
                <Search className="size-4" />
                Buscar
              </button>
            </form>
            <p className="mt-4 flex items-center gap-2 text-xs text-white/70">
              <Check className="size-4" />
              Consultar preços é gratuito e não exige conta.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-7">
            <div className="flex items-center justify-between">
              <ListChecks className="size-8 text-[#f9b05b]" />
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs">
                COMPRA PLANEJADA
              </span>
            </div>
            <h2 className="mt-8 text-2xl font-semibold">Cada item importa.</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Uma lista organizada ajuda você a decidir onde vale a pena
              comprar.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Encontre o produto certo",
                "Compare os preços registrados",
                "Salve sua lista de compras",
              ].map((text, index) => (
                <div
                  key={text}
                  className="flex items-center gap-4 border-t border-white/10 pt-4"
                >
                  <span className="text-sm text-[#f9b05b]">0{index + 1}</span>
                  <p className="text-sm">{text}</p>
                  <ArrowRight className="ml-auto size-4 text-white/50" />
                </div>
              ))}
            </div>
            <Link
              to="/comparar"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#f9b05b]"
            >
              Explorar preços <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
        <section id="como-funciona" className="py-16 sm:py-20">
          <p className="qt-eyebrow">SIMPLES DO COMEÇO AO FIM</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Uma compra melhor, em três passos.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Encontre e compare",
                text: "Busque por nome ou categoria. Veja preços do mesmo produto e a data da coleta.",
                href: "/comparar",
                action: "Comparar preços",
              },
              {
                icon: ListChecks,
                title: "Monte sua lista",
                text: "Escolha os itens e as quantidades. Sua lista fica salva na sua conta.",
                href: "/cliente/lista",
                action: "Criar minha lista",
              },
              {
                icon: Store,
                title: "Escolha onde comprar",
                text: "Consulte os mercados e seus endereços. O preço exibido é uma referência para planejar.",
                href: "/mercados",
                action: "Conhecer mercados",
              },
            ].map(({ icon: Icon, ...step }) => (
              <article key={step.title} className="qt-panel">
                <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="qt-muted mt-3">{step.text}</p>
                <Link
                  to={step.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-200"
                >
                  {step.action}
                  <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
