import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowLeftRight, Store, Info } from "lucide-react";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecosAtuais } from "@/hooks/usePrecos";
import { api } from "@/services/api";
import { normalizePrice, type BackendPrice } from "@/services/dashboard";
import { ProductImage } from "@/components/storefront/Media";
import { MeasurePrice, ProductCard } from "@/components/storefront/ProductCard";
import { ApiError } from "@/components/ui/ApiError";
import { formatCurrency } from "@/lib/utils";
import { displayDate } from "@/lib/offers";

export default function ComparadorPage() {
  const [params, setParams] = useSearchParams();
  const products = useProdutos();
  const prices = usePrecosAtuais();
  const all = (products.data?.content ?? []).filter(
    (p) => p.status === "ACTIVE",
  );
  const id = params.get("produto");
  const q = params.get("q") ?? "";
  const product = id
    ? all.find((p) => p.id === id)
    : all.find((p) =>
        `${p.name} ${p.brand}`
          .toLocaleLowerCase("pt-BR")
          .includes(q.toLocaleLowerCase("pt-BR")),
      );
  const mode =
    params.get("modo") === "embalagens" ? "embalagens" : "mercados";
  const packaging = useQuery({
    queryKey: ["embalagens", product?.id],
    queryFn: async () =>
      (
        await api.get<BackendPrice[]>(`/comparacoes/embalagens/${product!.id}`)
      ).data.map(normalizePrice),
    enabled: !!product,
  });
  const offers = (prices.data ?? [])
    .filter((p) => p.productId === product?.id)
    .sort((a, b) => a.price - b.price);
  const choices = mode === "embalagens" ? (packaging.data ?? []) : offers;
  const recommendations = all
    .filter((p) => p.id !== product?.id && p.category === product?.category)
    .slice(0, 4);

  return (
    <div className="w-full">
      <Link
        to="/explorar"
        className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-100"
      >
        <ArrowLeft className="size-4" />
        Explorar produtos
      </Link>

      {products.isPending || prices.isPending ? (
        <p role="status" className="py-10 text-center text-sm text-slate-500">
          Carregando produtos e preços…
        </p>
      ) : products.isError || prices.isError ? (
        <ApiError
          onRetry={() => {
            void products.refetch();
            void prices.refetch();
          }}
        />
      ) : !product ? (
        <div className="rounded-[30px] bg-[#f2eadc] px-6 py-14 text-center dark:bg-slate-900">
          <h1 className="text-3xl font-black tracking-tight text-brand-700 dark:text-brand-100">
            Produto não encontrado
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Esse produto não está no catálogo ativo. Procure outro produto para
            comparar.
          </p>
          <Link className="qt-action mt-5" to="/explorar">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <>
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(320px,460px)_minmax(0,1fr)] xl:gap-7">
            <section className="overflow-hidden rounded-[30px] bg-[#f2eadc] p-3 dark:bg-slate-900 sm:p-4">
              <ProductImage
                id={offers[0]?.imageId}
                alt={product.name}
                className="aspect-[4/3] w-full rounded-[24px] bg-white dark:bg-slate-800"
              />
              <div className="px-2 pb-3 pt-5 sm:px-3">
                <p className="mb-2 text-[11px] font-black uppercase tracking-[.18em] text-brand-600 dark:text-brand-200">
                  {product.category}
                </p>
                <h1 className="text-3xl font-black leading-none tracking-[-.04em] text-brand-700 dark:text-brand-100 sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-3 text-base font-semibold text-slate-700 dark:text-slate-200">
                  {product.brand} · {product.unit}
                </p>
                {product.description && (
                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {product.description}
                  </p>
                )}
                <p className="mt-5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  A foto pertence à oferta do mercado apresentado. Confira marca
                  e embalagem antes de comprar.
                </p>
              </div>
            </section>

            <section className="min-w-0">
              <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_36px_-28px_rgba(15,83,69,.4)] dark:bg-slate-900 sm:p-6 lg:p-7">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[.18em] text-orange-500">
                      COMPARAÇÃO DE PREÇOS
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-700 dark:text-brand-100 sm:text-3xl">
                      O mesmo produto. Uma escolha melhor.
                    </h2>
                  </div>

                  <div
                    className="flex rounded-2xl bg-[#f2eadc] p-1 dark:bg-slate-800"
                    role="group"
                    aria-label="Tipo de comparação"
                  >
                    {[
                      ["mercados", "Entre mercados"],
                      ["embalagens", "Outras embalagens"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        className={`min-h-10 flex-1 rounded-xl px-4 text-sm font-extrabold transition ${
                          mode === value
                            ? "bg-brand-700 text-white shadow-sm"
                            : "text-brand-700 hover:bg-white/70 dark:text-brand-100 dark:hover:bg-slate-700"
                        }`}
                        aria-pressed={mode === value}
                        onClick={() =>
                          setParams((old) => {
                            const next = new URLSearchParams(old);
                            next.set("produto", product.id);
                            next.set("modo", value);
                            return next;
                          })
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {mode === "embalagens" && (
                  <p className="mt-5 rounded-2xl bg-[#f8f6f0] p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Mesmo tipo de produto e marca, em medidas compatíveis.
                    Ordenado pelo menor preço por medida; a embalagem maior pode
                    exigir um desembolso maior.
                  </p>
                )}

                <div className="mt-5">
                  {mode === "embalagens" && packaging.isPending ? (
                    <p role="status">Comparando embalagens…</p>
                  ) : mode === "embalagens" && packaging.isError ? (
                    <ApiError onRetry={() => void packaging.refetch()} />
                  ) : choices.length ? (
                    <div className="space-y-3">
                      {choices.map((offer, index) => (
                        <article
                          key={offer.id}
                          className={`flex flex-col gap-4 rounded-[22px] p-4 sm:flex-row sm:items-center ${
                            index === 0
                              ? "bg-[#e6f2e8] dark:bg-brand-700/25"
                              : "bg-[#f8f6f0] dark:bg-slate-800"
                          }`}
                        >
                          <ProductImage
                            id={offer.imageId}
                            alt={`${offer.product} em ${offer.market}`}
                            className="hidden size-24 shrink-0 rounded-[18px] bg-white sm:flex"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-2 text-sm font-extrabold text-slate-800 dark:text-slate-100">
                              <Store className="size-4 shrink-0 text-brand-600" />
                              {offer.market}
                            </p>
                            {mode === "embalagens" && (
                              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                {offer.brand} · {offer.unit}
                              </p>
                            )}
                            <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
                              <p className="text-3xl font-black tracking-tight text-brand-700 dark:text-brand-100">
                                {formatCurrency(offer.price)}
                              </p>
                              <MeasurePrice
                                price={offer.unitPrice}
                                unit={offer.baseUnit}
                              />
                            </div>
                            <p className="mt-1 text-xs text-slate-400">
                              Coletado em {displayDate(offer.date)}
                            </p>
                            {index === 0 && (
                              <span className="mt-2 inline-block rounded-full bg-brand-700 px-3 py-1 text-xs font-bold text-white">
                                {mode === "embalagens"
                                  ? "Menor preço por medida"
                                  : "Menor preço registrado"}
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/lista?produto=${offer.productId}`}
                            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-[#ff982e] px-4 text-sm font-extrabold text-white transition hover:brightness-95"
                          >
                            Adicionar à lista
                          </Link>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[22px] bg-[#f8f6f0] px-5 py-9 text-center dark:bg-slate-800">
                      <h3 className="font-extrabold text-brand-700 dark:text-brand-100">
                        {mode === "embalagens"
                          ? "Ainda não há embalagens equivalentes cadastradas."
                          : "Ainda não há preço para este produto."}
                      </h3>
                      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {mode === "embalagens"
                          ? "A comparação precisa de marca, medida e grupo de equivalência conferidos no catálogo."
                          : "Você pode salvá-lo na lista e conferir novamente depois."}
                      </p>
                      {mode === "mercados" && (
                        <Link
                          className="qt-action mt-4"
                          to={`/lista?produto=${product.id}`}
                        >
                          Adicionar à minha lista
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    <Info className="mt-0.5 size-4 shrink-0" />
                    Preço da embalagem. Confirme o valor no mercado; a comparação
                    não garante estoque.
                  </p>
                  {mode === "mercados" &&
                    (packaging.data?.length ?? 0) > 1 && (
                      <button
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f2eadc] px-4 text-sm font-extrabold text-brand-700 dark:bg-slate-800 dark:text-brand-100"
                        onClick={() =>
                          setParams({ produto: product.id, modo: "embalagens" })
                        }
                      >
                        <ArrowLeftRight className="size-4" />
                        Qual embalagem rende mais?
                      </button>
                    )}
                </div>
              </div>
            </section>
          </div>

          {recommendations.length > 0 && (
            <section className="mt-8 rounded-[30px] bg-[#f2eadc] p-5 dark:bg-slate-900 sm:p-7">
              <div className="mb-5">
                <h2 className="text-2xl font-black tracking-tight text-brand-700 dark:text-brand-100">
                  Mais opções para sua compra
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Outros produtos de {product.category.toLocaleLowerCase("pt-BR")}
                  , para você escolher.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {recommendations.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    offer={
                      (prices.data ?? [])
                        .filter((o) => o.productId === p.id)
                        .sort((a, b) => a.price - b.price)[0]
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
