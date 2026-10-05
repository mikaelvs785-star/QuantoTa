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
    <p className="text-xs text-slate-500 dark:text-slate-400">
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
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_12px_34px_-24px_rgba(15,83,69,.45)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_-22px_rgba(15,83,69,.35)] dark:bg-slate-900">
      <Link
        to={`/comparar?produto=${product.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="block bg-[#f1eadf] p-2 dark:bg-slate-800"
      >
        <ProductImage
          id={offer?.imageId}
          alt={product.name}
          className="aspect-[4/3] w-full rounded-[16px] transition duration-200 group-hover:scale-[1.015]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="min-h-[44px]">
          <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-[#153f34] dark:text-brand-100 sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
            {[product.brand, product.unit].filter(Boolean).join(" · ")}
          </p>
        </div>
        <p className="mt-3 text-2xl font-black tracking-tight text-brand-700 dark:text-brand-100">
          {offer ? formatCurrency(offer.price) : "Sem preço"}
        </p>
        <MeasurePrice price={offer?.unitPrice} unit={offer?.baseUnit} />
        {offer && (
          <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-1.5 font-semibold">
              <Store className="size-3.5 shrink-0" />
              <span className="truncate">{offer.market}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Coletado em {displayDate(offer.date)}
            </p>
          </div>
        )}
        <Link
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#ff982e] px-4 text-sm font-extrabold text-white transition hover:brightness-95"
          to={`/comparar?produto=${product.id}`}
        >
          Comparar preços
        </Link>
      </div>
    </article>
  );
}
