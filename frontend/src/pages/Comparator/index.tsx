import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Package, Store, ArrowRight } from "lucide-react";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecos } from "@/hooks/usePrecos";
import { ApiError } from "@/components/ui/ApiError";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { offersForProduct, displayDate } from "@/lib/offers";
import { formatCurrency } from "@/lib/utils";
export default function ComparadorPage() {
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState("");
  const search = params.get("q") ?? "";
  const productsQuery = useProdutos();
  const pricesQuery = usePrecos();
  const products = (productsQuery.data?.content ?? []).filter(
    (p) => p.status === "ACTIVE",
  );
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const filtered = products.filter(
    (p) =>
      (!category || p.category === category) &&
      `${p.name} ${p.brand ?? ""} ${p.unit ?? ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(search.toLocaleLowerCase("pt-BR")),
  );
  const selected =
    filtered.find((p) => p.id === params.get("produto")) ?? filtered[0];
  const offers = selected
    ? offersForProduct(pricesQuery.data ?? [], selected.id)
    : [];
  const difference =
    offers.length > 1
      ? offers[offers.length - 1].price - offers[0].price
      : null;
  function updateParam(key: string, value: string) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }
  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title="O mesmo produto. Outros preços."
        description="Compare marca e unidade iguais, veja a data de coleta e escolha onde comprar."
      />
      <div className="qt-panel mb-6">
        <label className="relative block">
          <span className="sr-only">Buscar produto</span>
          <Search className="pointer-events-none absolute left-4 top-4 size-5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => updateParam("q", e.target.value)}
            className="h-14 pl-12"
            placeholder="Busque arroz, leite, café..."
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={`qt-chip ${!category ? "qt-chip-active" : ""}`}
          >
            Todas as categorias
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`qt-chip ${category === c ? "qt-chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      {productsQuery.isPending || pricesQuery.isPending ? (
        <p role="status" className="qt-panel">
          Carregando produtos e preços...
        </p>
      ) : productsQuery.isError || pricesQuery.isError ? (
        <ApiError
          onRetry={() => {
            void productsQuery.refetch();
            void pricesQuery.refetch();
          }}
        />
      ) : !filtered.length ? (
        <div className="qt-empty">
          <Package className="mx-auto size-9 text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold">
            Nenhum produto encontrado
          </h2>
          <p className="qt-muted mt-2">
            Tente outro nome ou categoria. O catálogo aparece conforme os
            produtos são cadastrados.
          </p>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
          <section className="qt-panel">
            <p className="qt-eyebrow mb-4">
              {filtered.length} PRODUTOS ENCONTRADOS
            </p>
            <div className="max-h-[560px] space-y-2 overflow-y-auto">
              {filtered.map((product) => (
                <button
                  key={product.id}
                  aria-pressed={selected?.id === product.id}
                  onClick={() => updateParam("produto", product.id)}
                  className={`w-full rounded-xl border p-4 text-left ${selected?.id === product.id ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  <p className="font-semibold">{product.name}</p>
                  <p className="qt-muted mt-1">
                    {[product.brand, product.unit, product.category]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </button>
              ))}
            </div>
          </section>
          <section>
            <div className="qt-panel">
              <p className="qt-eyebrow">PRODUTO SELECIONADO</p>
              <h2 className="mt-3 text-2xl font-bold">{selected.name}</h2>
              <p className="qt-muted mt-2">
                {[selected.brand, selected.unit, selected.category]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="mt-6 grid gap-5 border-t pt-6 sm:grid-cols-3">
                <div>
                  <p className="qt-muted">Menor preço registrado</p>
                  <p className="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-200">
                    {offers[0] ? formatCurrency(offers[0].price) : "Sem preço"}
                  </p>
                </div>
                <div>
                  <p className="qt-muted">Mercados com preço</p>
                  <p className="mt-2 text-3xl font-bold">{offers.length}</p>
                </div>
                <div>
                  <p className="qt-muted">Diferença entre mercados</p>
                  <p className="mt-2 text-3xl font-bold">
                    {difference !== null ? formatCurrency(difference) : "—"}
                  </p>
                </div>
              </div>
              <Link
                to={`/lista?produto=${selected.id}`}
                className="qt-action mt-6"
              >
                Adicionar à minha lista <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {offers.length ? (
                offers.map((offer, index) => (
                  <article
                    key={offer.id}
                    className={`qt-offer ${index === 0 ? "border-brand-500" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15">
                        <Store className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold">{offer.market}</h3>
                        <p className="qt-muted">
                          Coletado em {displayDate(offer.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {formatCurrency(offer.price)}
                      </p>
                      {index === 0 && (
                        <span className="text-xs font-semibold text-brand-600 dark:text-brand-200">
                          Menor preço registrado
                        </span>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="qt-empty">
                  <p className="font-semibold">
                    Ainda não há preço para este produto.
                  </p>
                  <p className="qt-muted mt-2">
                    Você pode salvá-lo na lista e conferir novamente depois.
                  </p>
                </div>
              )}
            </div>
            <p className="qt-muted mt-5">
              Valores informados pelos cadastros, sujeitos a alteração no
              mercado. A diferença exibida é uma comparação, não uma economia já
              realizada.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
