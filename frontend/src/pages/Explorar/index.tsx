import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Store } from "lucide-react";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecosAtuais } from "@/hooks/usePrecos";
import { getCollections } from "@/services/vitrine";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ApiError } from "@/components/ui/ApiError";

export default function Explorar() {
  const [params, setParams] = useSearchParams();
  const products = useProdutos();
  const prices = usePrecosAtuais();
  const collections = useQuery({
    queryKey: ["vitrine"],
    queryFn: getCollections,
  });

  const q = params.get("q") ?? "";
  const category = params.get("categoria") ?? "";
  const order = params.get("ordem") ?? "nome";
  const collection = params.get("colecao");

  const set = (key: string, value: string) =>
    setParams(
      (old) => {
        const next = new URLSearchParams(old);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  const all = (products.data?.content ?? []).filter(
    (p) => p.status === "ACTIVE",
  );
  const group = collections.data?.find((c) => String(c.id) === collection);
  const offers = new Map<string, NonNullable<typeof prices.data>[number]>();
  for (const o of [...(prices.data ?? [])].sort((a, b) => a.price - b.price)) {
    if (!offers.has(o.productId)) offers.set(o.productId, o);
  }

  const filtered = all
    .filter(
      (p) =>
        (!category || p.category === category) &&
        (!collection || group?.produtoIds.includes(Number(p.id))) &&
        `${p.name} ${p.brand} ${p.unit}`
          .toLocaleLowerCase("pt-BR")
          .includes(q.toLocaleLowerCase("pt-BR")),
    )
    .sort((a, b) =>
      order === "preco"
        ? (offers.get(a.id)?.price ?? Infinity) -
            (offers.get(b.id)?.price ?? Infinity) ||
          a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    );

  const categories = [...new Set(all.map((p) => p.category))];

  return (
    <div className="w-full">
      <section className="mb-5 grid gap-6 overflow-hidden rounded-[30px] bg-[#f2eadc] px-5 py-6 dark:bg-slate-900 sm:px-7 lg:grid-cols-[minmax(0,1fr)_minmax(440px,.92fr)] lg:items-end lg:px-9 lg:py-9">
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[.18em] text-brand-600 dark:text-brand-200">
            COMPARAÇÃO SIMPLES, DECISÃO MELHOR
          </p>
          <h1 className="text-3xl font-black leading-[1.02] tracking-[-.04em] text-brand-700 dark:text-brand-100 sm:text-4xl lg:text-5xl">
            {group?.titulo ?? "Encontre o que sua casa precisa."}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            {group?.descricao ??
              "Veja a embalagem, compare o preço e escolha o que realmente faz sentido para a sua compra."}
          </p>
        </div>

        <div className="rounded-[24px] bg-white p-3 shadow-[0_16px_40px_-28px_rgba(15,83,69,.45)] dark:bg-slate-950">
          <label className="flex min-h-12 items-center gap-3 rounded-[18px] bg-[#f8f6f0] px-4 dark:bg-slate-900">
            <Search className="size-5 shrink-0 text-brand-600" />
            <input
              aria-label="Buscar produto"
              value={q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Busque arroz, leite, café…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
          <div className="mt-3 flex items-center gap-2">
            <SlidersHorizontal className="ml-1 size-4 text-slate-400" />
            <select
              aria-label="Ordenar produtos"
              className="min-h-10 flex-1 rounded-xl bg-[#f8f6f0] px-3 text-sm font-semibold outline-none dark:bg-slate-900"
              value={order}
              onChange={(e) => set("ordem", e.target.value)}
            >
              <option value="nome">Nome do produto</option>
              <option value="preco">Menor preço da embalagem</option>
            </select>
          </div>
        </div>
      </section>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => set("categoria", "")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
            !category
              ? "bg-brand-700 text-white"
              : "bg-white text-slate-700 shadow-sm hover:bg-brand-50 dark:bg-slate-900 dark:text-slate-200"
          }`}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => set("categoria", c)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              category === c
                ? "bg-brand-700 text-white"
                : "bg-white text-slate-700 shadow-sm hover:bg-brand-50 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            {c}
          </button>
        ))}
        {collection && (
          <button
            className="shrink-0 rounded-full bg-[#f2eadc] px-4 py-2 text-sm font-bold text-brand-700 dark:bg-slate-800 dark:text-brand-100"
            onClick={() => set("colecao", "")}
          >
            Sair da coleção
          </button>
        )}
        <Link
          to="/catalogo?aba=mercados"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f2eadc] px-4 py-2 text-sm font-bold text-brand-700 dark:bg-slate-800 dark:text-brand-100"
        >
          <Store className="size-4" />
          Mercados
        </Link>
      </div>

      {products.isPending ||
      prices.isPending ||
      (collection && collections.isPending) ? (
        <p role="status" className="py-10 text-center text-sm text-slate-500">
          Buscando produtos…
        </p>
      ) : products.isError ||
        prices.isError ||
        (collection && collections.isError) ? (
        <ApiError
          onRetry={() => {
            void products.refetch();
            void prices.refetch();
            void collections.refetch();
          }}
        />
      ) : filtered.length ? (
        <>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-brand-700 dark:text-brand-100">
                Produtos para comparar
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filtered.length} resultado(s) encontrado(s)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} offer={offers.get(p.id)} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-[28px] bg-[#f2eadc] px-6 py-14 text-center dark:bg-slate-900">
          <h2 className="text-xl font-black text-brand-700 dark:text-brand-100">
            Nenhum produto encontrado
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Experimente outro nome ou categoria.
          </p>
        </div>
      )}
    </div>
  );
}
