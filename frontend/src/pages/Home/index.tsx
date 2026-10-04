import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, ListChecks } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecosAtuais } from "@/hooks/usePrecos";
import { ProductCard } from "@/components/storefront/ProductCard";
import { imageUrl } from "@/services/images";
import { getCollections } from "@/services/vitrine";
import { ApiError } from "@/components/ui/ApiError";
export default function HomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const products = useProdutos();
  const prices = usePrecosAtuais();
  const collections = useQuery({
    queryKey: ["vitrine"],
    queryFn: getCollections,
  });
  const active = (products.data?.content ?? []).filter(
    (p) => p.status === "ACTIVE",
  );
  const categories = [...new Set(active.map((p) => p.category))].slice(0, 6);
  const featured = active
    .filter((p) => prices.data?.some((o) => o.productId === p.id))
    .slice(0, 8);
  return (
    <div className="space-y-9">
      <section className="qt-retail-hero">
        <img
          src="/images/hero-market.png"
          alt="Alimentos frescos, pão e frutas para abastecer a casa"
        />
        <div className="relative max-w-xl">
          <p className="qt-eyebrow mb-4">UMA COMPRA BEM PENSADA</p>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-700 sm:text-5xl">
            Compre melhor.
            <br />
            Cuide do seu dinheiro.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-brand-700">
            Compare o preço da embalagem, confira quanto rende e planeje sua
            próxima compra.
          </p>
          <form
            className="mt-7 flex rounded-full border bg-white p-1.5 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/explorar?q=${encodeURIComponent(search.trim())}`);
            }}
          >
            <label className="flex min-w-0 flex-1 items-center gap-2 pl-3 text-brand-700">
              <Search className="size-5 shrink-0" />
              <input
                className="w-full bg-transparent py-3 text-sm outline-none"
                aria-label="Produto para comparar"
                placeholder="O que vai para sua lista hoje?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button className="qt-action !rounded-full !px-5" type="submit">
              Buscar
            </button>
          </form>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="qt-action" to="/explorar">
              Explorar produtos
              <ArrowRight className="size-4" />
            </Link>
            <Link className="qt-secondary" to="/lista">
              <ListChecks className="size-5" />
              Comparar minha lista
            </Link>
          </div>
        </div>
      </section>
      {categories.length > 0 && (
        <nav aria-label="Categorias" className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              className="qt-chip bg-white dark:bg-slate-900"
              key={c}
              to={`/explorar?categoria=${encodeURIComponent(c)}`}
            >
              {c}
              <ArrowRight className="size-4" />
            </Link>
          ))}
        </nav>
      )}
      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="qt-eyebrow mb-2">PREÇOS REGISTRADOS NOS MERCADOS</p>
            <h2 className="qt-section-heading">Bons preços para sua semana</h2>
          </div>
          <Link className="shrink-0 text-sm font-semibold" to="/explorar">
            Ver todos →
          </Link>
        </div>
        {products.isPending || prices.isPending ? (
          <p role="status">Buscando produtos e preços…</p>
        ) : products.isError || prices.isError ? (
          <ApiError
            onRetry={() => {
              void products.refetch();
              void prices.refetch();
            }}
          />
        ) : featured.length ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                offer={
                  [...(prices.data ?? [])]
                    .filter((o) => o.productId === p.id)
                    .sort((a, b) => a.price - b.price)[0]
                }
              />
            ))}
          </div>
        ) : (
          <div className="qt-empty">
            <h3 className="font-bold">Estamos preparando a vitrine.</h3>
            <p className="qt-muted mt-2">
              Os produtos aparecem aqui assim que os mercados registram seus
              preços.
            </p>
            <Link to="/explorar" className="qt-secondary mt-4">
              Conhecer o catálogo
            </Link>
          </div>
        )}
      </section>
      {collections.isError && (
        <ApiError onRetry={() => void collections.refetch()} />
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {collections.data?.map((c) => (
          <Link
            to={`/explorar?colecao=${c.id}`}
            key={c.id}
            className="qt-collection"
          >
            {c.imagemId && (
              <img src={imageUrl(c.imagemId)} alt="" loading="lazy" />
            )}
            <div>
              <h2 className="text-2xl font-bold">{c.titulo}</h2>
              <p className="mt-3 text-sm leading-6">{c.descricao}</p>
              <span className="qt-action mt-5">
                Explorar produtos
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
        <section className="qt-collection !bg-brand-50 dark:!bg-brand-700/20">
          <div>
            <h2 className="text-2xl font-bold">
              Sua lista custa menos em qual mercado?
            </h2>
            <p className="mt-3 text-sm leading-6">
              Compare o total da mesma compra, com os mesmos produtos e
              quantidades.
            </p>
            <Link to="/lista" className="qt-action mt-5">
              Comparar minha lista
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
