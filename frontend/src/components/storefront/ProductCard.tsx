import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import type { Product } from "@/types/product";
import type { PriceRecord } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils";
import { displayDate } from "@/lib/offers";
import { ProductImage } from "./Media";
export function MeasurePrice({
  price,
  unit,
}: {
  price?: number | null;
  unit?: string | null;
}) {
  if (price == null || !unit) return null;
  return (
    <p className="qt-muted">
      {new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(price)}
      /{unit}
    </p>
  );
}
export function ProductCard({
  product,
  offer,
}: {
  product: Product;
  offer?: PriceRecord;
}) {
  return (
    <article className="qt-product-card">
      <Link
        to={`/comparar?produto=${product.id}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage
          id={offer?.imageId}
          alt={product.name}
          className="aspect-[4/3] w-full rounded-t-2xl"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold">{product.name}</h3>
        <p className="qt-muted">
          {[product.brand, product.unit].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-3 text-2xl font-bold tracking-tight text-brand-700 dark:text-brand-100">
          {offer ? formatCurrency(offer.price) : "Sem preço"}
        </p>
        <MeasurePrice price={offer?.unitPrice} unit={offer?.baseUnit} />
        {offer && (
          <>
            <p className="mt-3 flex items-center gap-2 text-xs">
              <Store className="size-4 shrink-0" />
              {offer.market}
            </p>
            <p className="qt-muted mt-1 text-xs">
              Coletado em {displayDate(offer.date)}
            </p>
          </>
        )}
        <Link
          className="qt-action mt-4 w-full text-sm"
          to={`/comparar?produto=${product.id}`}
        >
          Comparar preços
        </Link>
      </div>
    </article>
  );
}
