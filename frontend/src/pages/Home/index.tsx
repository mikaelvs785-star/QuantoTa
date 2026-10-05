import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Grid2X2,
  ListChecks,
  Search,
  Store,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecosAtuais } from "@/hooks/usePrecos";
import { MeasurePrice } from "@/components/storefront/ProductCard";
import { ProductImage } from "@/components/storefront/Media";
import { imageUrl } from "@/services/images";
import { getCollections } from "@/services/vitrine";
import { formatCurrency } from "@/lib/utils";
import { displayDate } from "@/lib/offers";
import type { Product } from "@/types/product";
import type { PriceRecord } from "@/types/dashboard";

const categoryShortcuts = [
  {
    label: "Mercearia",
    query: "arroz",
    position: "22% center",
  },
  {
    label: "Hortifruti",
    query: "fruta",
    position: "52% center",
  },
  {
    label: "Café da manhã",
    query: "café",
    position: "72% center",
  },
  {
    label: "Limpeza",
    query: "limpeza",
    position: "94% center",
  },
];

function HomeOfferCard({
  product,
  offer,
}: {
  product: Product;
  offer: PriceRecord;
}) {
  return (
    <article className="qt-home-offer-card">
      <Link
        to={`/comparar?produto=${product.id}`}
        className="qt-home-offer-photo"
        aria-label={`Comparar ${product.name}`}
      >
        <ProductImage
          id={offer.imageId}
          alt={product.name}
          className="h-full w-full"
        />
      </Link>

      <div className="qt-home-offer-body">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-extrabold text-[#153f34] dark:text-brand-100">
            {product.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {[product.brand, product.unit].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div>
          <p className="text-[1.65rem] font-black leading-none tracking-tight text-brand-700 dark:text-brand-100">
            {formatCurrency(offer.price)}
          </p>
          <MeasurePrice price={offer.unitPrice} unit={offer.baseUnit} />
        </div>

        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <p className="flex items-center gap-1.5 font-semibold">
            <Store className="size-3.5 shrink-0" />
            <span className="truncate">{offer.market}</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Coletado em {displayDate(offer.date)}
          </p>
        </div>

        <Link
          className="qt-home-offer-button"
          to={`/comparar?produto=${product.id}`}
        >
          Comparar preços
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const products = useProdutos();
  const prices = usePrecosAtuais();
  const collections = useQuery({
    queryKey: ["vitrine"],
    queryFn: getCollections,
  });

  const active = useMemo(
    () =>
      (products.data?.content ?? []).filter((product) => product.status === "ACTIVE"),
    [products.data?.content],
  );

  const bestOfferByProduct = useMemo(() => {
    const result = new Map<string, PriceRecord>();
    for (const offer of prices.data ?? []) {
      const current = result.get(offer.productId);
      if (!current || offer.price < current.price) {
        result.set(offer.productId, offer);
      }
    }
    return result;
  }, [prices.data]);

  const featured = active
    .filter((product) => bestOfferByProduct.has(product.id))
    .slice(0, 4);

  const latestDate = useMemo(() => {
    const dates = (prices.data ?? [])
      .map((offer) => offer.date)
      .filter((value): value is string => Boolean(value))
      .sort();
    return dates.length ? dates[dates.length - 1] : null;
  }, [prices.data]);

  const promo = collections.data?.[0];

  return (
    <div className="qt-home-page">
      <section className="qt-home-hero">
        <img
          src="/images/hero-market.png"
          alt="Sacola de compras com alimentos para abastecer a casa"
        />

        <div className="qt-home-hero-content">
          <h1>
            Compre melhor.
            <br />
            Cuide do seu dinheiro.
          </h1>
          <p>
            Compare o preço da embalagem, confira quanto rende
            <br className="hidden sm:block" /> e planeje sua compra.
          </p>

          <form
            className="qt-home-search"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(`/explorar?q=${encodeURIComponent(search.trim())}`);
            }}
          >
            <label>
              <Search className="size-5 shrink-0" />
              <input
                aria-label="Produto para comparar"
                placeholder="O que vai para sua lista hoje?"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <button type="submit">Buscar</button>
          </form>

          <div className="qt-home-actions">
            <Link to="/explorar" className="qt-home-primary-action">
              <Grid2X2 className="size-4" />
              Explorar produtos
            </Link>
            <Link to="/lista" className="qt-home-secondary-action">
              <ListChecks className="size-4" />
              Comparar minha lista
            </Link>
          </div>
        </div>
      </section>

      <nav aria-label="Categorias em destaque" className="qt-home-categories">
        {categoryShortcuts.map((category) => (
          <Link
            key={category.label}
            to={`/explorar?q=${encodeURIComponent(category.query)}`}
            className="qt-category-card"
          >
            <img
              src="/images/hero-market.png"
              alt=""
              aria-hidden="true"
              style={{ objectPosition: category.position }}
            />
            <span>
              {category.label}
              <ArrowRight className="size-4" />
            </span>
          </Link>
        ))}
      </nav>

      <section className="qt-weekly-section">
        <div className="qt-weekly-heading">
          <h2>Bons preços para sua semana</h2>
          {latestDate && <span>Coletados em {displayDate(latestDate)}</span>}
        </div>

        {products.isPending || prices.isPending ? (
          <div className="qt-home-loading">Buscando os melhores preços…</div>
        ) : featured.length ? (
          <div className="qt-home-offer-grid">
            {featured.map((product) => (
              <HomeOfferCard
                key={product.id}
                product={product}
                offer={bestOfferByProduct.get(product.id)!}
              />
            ))}
          </div>
        ) : (
          <div className="qt-home-empty">
            <strong>Os mercados ainda estão preparando as ofertas.</strong>
            <span>
              Assim que houver preços cadastrados, eles aparecem aqui.
            </span>
          </div>
        )}
      </section>

      <section className="qt-home-promo-grid">
        <Link
          to={promo ? `/explorar?colecao=${promo.id}` : "/explorar?q=café"}
          className="qt-home-promo qt-home-promo-photo"
        >
          <img
            src={promo?.imagemId ? imageUrl(promo.imagemId) : "/images/hero-market.png"}
            alt=""
            aria-hidden="true"
          />
          <div>
            <h2>{promo?.titulo ?? "Complete seu café da manhã"}</h2>
            <p>
              {promo?.descricao ??
                "Tudo para um café da manhã mais gostoso e com o melhor preço."}
            </p>
            <span className="qt-home-promo-button">Explorar produtos</span>
          </div>
        </Link>

        <Link to="/lista" className="qt-home-promo qt-home-promo-list">
          <div>
            <h2>Sua lista custa menos em qual mercado?</h2>
            <p>
              Compare o total da mesma compra, com as mesmas quantidades.
            </p>
            <span className="qt-home-promo-button">Comparar minha lista</span>
          </div>

          <div className="qt-list-note" aria-hidden="true">
            <span>☐ Arroz</span>
            <span>☐ Feijão</span>
            <span>☐ Leite</span>
            <span>☐ Café</span>
            <span>☐ Pão</span>
            <span>☐ Frutas</span>
            <span>☐ Limpeza</span>
          </div>
        </Link>
      </section>
    </div>
  );
}
