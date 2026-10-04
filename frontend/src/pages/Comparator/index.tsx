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
  const mode = params.get("modo") === "embalagens" ? "embalagens" : "mercados";
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
    .slice(0, 3);
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/explorar"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold"
      >
        <ArrowLeft className="size-4" />
        Explorar produtos
      </Link>
      {products.isPending || prices.isPending ? (
        <p role="status">Carregando produtos e preços…</p>
      ) : products.isError || prices.isError ? (
        <ApiError
          onRetry={() => {
            void products.refetch();
            void prices.refetch();
          }}
        />
      ) : !product ? (
        <div className="qt-empty">
          <h1 className="qt-heading">Produto não encontrado</h1>
          <p className="qt-muted mt-3">
            Esse produto não está no catálogo ativo. Procure outro produto para
            comparar.
          </p>
          <Link className="qt-action mt-5" to="/explorar">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <>
          <div className="grid items-start gap-7 lg:grid-cols-[.8fr_1.2fr]">
            <section className="qt-panel !p-0 overflow-hidden">
              <ProductImage
                id={offers[0]?.imageId}
                alt={product.name}
                className="aspect-[4/3] w-full"
              />
              <div className="p-6">
                <p className="qt-eyebrow mb-2">{product.category}</p>
                <h1 className="qt-heading">{product.name}</h1>
                <p className="mt-2 text-lg">
                  {product.brand} · {product.unit}
                </p>
                {product.description && (
                  <p className="qt-muted mt-4">{product.description}</p>
                )}
                <p className="qt-muted mt-5">
                  A foto pertence à oferta do mercado apresentado. Confira marca
                  e embalagem antes de comprar.
                </p>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-brand-700 dark:text-brand-100">
                O mesmo produto. Uma escolha melhor.
              </h2>
              <div
                className="my-5 flex gap-2"
                role="group"
                aria-label="Tipo de comparação"
              >
                {[
                  ["mercados", "Entre mercados"],
                  ["embalagens", "Outras embalagens"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={`qt-chip flex-1 justify-center ${mode === value ? "qt-chip-active" : ""}`}
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
              {mode === "embalagens" && (
                <p className="qt-muted mb-4">
                  Mesmo tipo de produto e marca, em medidas compatíveis.
                  Ordenado pelo menor preço por medida; a embalagem maior pode
                  exigir um desembolso maior.
                </p>
              )}
              {mode === "embalagens" && packaging.isPending ? (
                <p role="status">Comparando embalagens…</p>
              ) : mode === "embalagens" && packaging.isError ? (
                <ApiError onRetry={() => void packaging.refetch()} />
              ) : choices.length ? (
                <div className="space-y-3">
                  {choices.map((offer, index) => (
                    <article
                      key={offer.id}
                      className={`qt-offer !flex-nowrap ${index === 0 ? "!border-brand-500" : ""}`}
                    >
                      <ProductImage
                        id={offer.imageId}
                        alt={`${offer.product} em ${offer.market}`}
                        className="hidden size-24 shrink-0 rounded-xl sm:flex"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 font-semibold">
                          <Store className="size-4 shrink-0" />
                          {offer.market}
                        </p>
                        {mode === "embalagens" && (
                          <p className="mt-1 text-sm font-semibold">
                            {offer.brand} · {offer.unit}
                          </p>
                        )}
                        <p className="mt-2 text-3xl font-bold text-brand-700 dark:text-brand-100">
                          {formatCurrency(offer.price)}
                        </p>
                        <MeasurePrice
                          price={offer.unitPrice}
                          unit={offer.baseUnit}
                        />
                        <p className="qt-muted text-xs">
                          Coletado em {displayDate(offer.date)}
                        </p>
                        {index === 0 && (
                          <span className="mt-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-700 dark:text-white">
                            {mode === "embalagens"
                              ? "Menor preço por medida"
                              : "Menor preço registrado"}
                          </span>
                        )}
                        <Link
                          to={`/lista?produto=${offer.productId}`}
                          className="qt-action mt-3 w-full text-sm sm:w-auto"
                        >
                          Adicionar à lista
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="qt-empty">
                  <h3 className="font-semibold">
                    {mode === "embalagens"
                      ? "Ainda não há embalagens equivalentes cadastradas."
                      : "Ainda não há preço para este produto."}
                  </h3>
                  <p className="qt-muted mt-3">
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
              <p className="qt-muted mt-5 flex gap-2">
                <Info className="mt-1 size-4 shrink-0" />
                Preço da embalagem. Confirme o valor no mercado; a comparação
                não garante estoque.
              </p>
              {mode === "mercados" && (packaging.data?.length ?? 0) > 1 && (
                <button
                  className="qt-secondary mt-5 w-full"
                  onClick={() =>
                    setParams({ produto: product.id, modo: "embalagens" })
                  }
                >
                  <ArrowLeftRight className="size-5" />
                  Qual embalagem rende mais?
                </button>
              )}
            </section>
          </div>
          {recommendations.length > 0 && (
            <section className="mt-10">
              <h2 className="qt-section-heading mb-2">
                Mais opções para sua compra
              </h2>
              <p className="qt-muted mb-5">
                Outros produtos de {product.category.toLocaleLowerCase("pt-BR")}
                , para você escolher.
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
