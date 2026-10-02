import { ArrowRight, Package, Store, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { formatCurrency } from "@/lib/utils";
import { displayDate } from "@/lib/offers";
const icons = { products: Package, markets: Store, prices: Tags };
export default function Home() {
  const query = useDashboard();
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title={`QuantoTá${user ? `, ${user.name.split(" ")[0]}` : ""}?`}
        description="Compare preços, conheça os mercados e organize sua próxima compra."
      />
      <section className="qt-panel mb-6">
        <h2 className="text-xl font-semibold">O que você precisa comprar?</h2>
        <form
          action="/comparar"
          className="mt-5 flex flex-wrap items-end gap-3"
        >
          <label className="min-w-0 flex-1">
            <span className="mb-2 block text-sm font-semibold">
              Produto para comparar
            </span>
            <Input name="q" placeholder="Ex.: arroz, leite ou café" required />
          </label>
          <Button type="submit">
            Buscar <ArrowRight className="size-4" />
          </Button>
        </form>
      </section>
      {query.isPending ? (
        <p role="status" className="qt-panel">
          Carregando catálogo...
        </p>
      ) : query.isError ? (
        <ApiError onRetry={() => void query.refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {query.data.metrics.map((metric) => {
              const Icon = icons[metric.key];
              return (
                <div key={metric.key} className="qt-stat">
                  <div className="flex items-center justify-between">
                    <p className="qt-muted">{metric.label}</p>
                    <Icon className="size-5 text-brand-600" />
                  </div>
                  <p className="mt-4 text-3xl font-bold">{metric.value}</p>
                </div>
              );
            })}
          </div>
          <section className="qt-panel mt-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Preços registrados recentemente
                </h2>
                <p className="qt-muted mt-1">
                  Uma referência para planejar. Confira no estabelecimento.
                </p>
              </div>
              <Link
                to="/precos"
                className="text-sm font-bold text-brand-600 dark:text-brand-200"
              >
                Ver preços →
              </Link>
            </div>
            {query.data.latestPrices.length ? (
              <div className="divide-y">
                {query.data.latestPrices.map((price) => (
                  <div
                    key={price.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <div>
                      <Link
                        to={`/comparar?produto=${price.productId}`}
                        className="font-semibold hover:underline"
                      >
                        {price.product}
                      </Link>
                      <p className="qt-muted">
                        {price.market} · {displayDate(price.date)}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-brand-600 dark:text-brand-200">
                      {formatCurrency(price.price)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="qt-muted">Ainda não há preços cadastrados.</p>
            )}
          </section>
        </>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Minha lista de compras",
            text: "Salve os itens e quantidades que precisa comprar.",
            href: "/lista",
          },
          {
            title: "Consultar o catálogo",
            text: "Encontre produtos e mercados em um só lugar.",
            href: "/catalogo",
          },
        ].map((action) => (
          <Link key={action.href} to={action.href} className="qt-panel group">
            <h2 className="flex items-center justify-between text-lg font-semibold">
              {action.title}
              <ArrowRight className="size-5 text-brand-600 transition group-hover:translate-x-1" />
            </h2>
            <p className="qt-muted mt-2">{action.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
