import { ArrowRight, Package, Store, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/components/ui/ApiError";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { formatCurrency } from "@/lib/utils";
import { displayDate } from "@/lib/offers";
const icons = { products: Package, markets: Store, prices: Tags };
export default function Dashboard() {
  const query = useDashboard();
  const { user } = useAuth();
  const admin = user?.role === "ADMIN";
  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title={
          admin
            ? "Catálogo sob controle."
            : `Vamos planejar sua compra${user ? `, ${user.name.split(" ")[0]}` : ""}?`
        }
        description={
          admin
            ? "Produtos, mercados e preços que sustentam as comparações."
            : "Encontre preços, compare mercados e organize o que você precisa."
        }
      />
      {!admin && (
        <section className="qt-hero mb-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-brand-200">
              SUA PRÓXIMA COMPRA
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Antes de comprar, compare.
            </h2>
            <p className="mt-3 text-sm text-white/70">
              O menor preço de hoje pode mudar. Confira sempre a data.
            </p>
          </div>
          <Link to="/comparar" className="qt-action">
            Comparar preços <ArrowRight className="size-4" />
          </Link>
        </section>
      )}
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
                to={admin ? "/precos" : "/comparar"}
                className="text-sm font-bold text-brand-600 dark:text-brand-200"
              >
                {admin ? "Gerenciar preços" : "Ver comparador"} →
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
        {(admin
          ? [
              {
                title: "Organizar produtos",
                text: "Marca, categoria e unidade precisam identificar o item comparado.",
                href: "/produtos",
              },
              {
                title: "Atualizar preços",
                text: "Registre produto, mercado, valor e data de coleta.",
                href: "/precos",
              },
            ]
          : [
              {
                title: "Minha lista de compras",
                text: "Itens e quantidades salvos para consultar depois.",
                href: "/lista",
              },
              {
                title: "Conhecer os mercados",
                text: "Consulte os estabelecimentos do catálogo.",
                href: "/mercados",
              },
            ]
        ).map((action) => (
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
