import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
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
  const q = params.get("q") ?? "",
    category = params.get("categoria") ?? "",
    order = params.get("ordem") ?? "nome",
    collection = params.get("colecao");
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
  for (const o of [...(prices.data ?? [])].sort((a, b) => a.price - b.price))
    if (!offers.has(o.productId)) offers.set(o.productId, o);
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
  return (
    <div>
      <h1 className="qt-heading">
        {group?.titulo ?? "Encontre o que sua casa precisa."}
      </h1>
      <p className="qt-muted mt-3">
        {group?.descricao ??
          "Veja a embalagem, compare o preço e escolha o que combina com sua compra."}
      </p>
      <div className="my-6 flex flex-wrap gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full border bg-white px-5 py-3 dark:bg-slate-900">
          <Search className="size-5" />
          <input
            aria-label="Buscar produto"
            value={q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Busque arroz, leite, café…"
            className="w-full bg-transparent outline-none"
          />
        </label>
        <select
          aria-label="Ordenar produtos"
          className="qt-select !h-12 !w-auto"
          value={order}
          onChange={(e) => set("ordem", e.target.value)}
        >
          <option value="nome">Nome do produto</option>
          <option value="preco">Menor preço da embalagem</option>
        </select>
      </div>
      <div className="mb-7 flex flex-wrap gap-2">
        <button
          onClick={() => set("categoria", "")}
          className={`qt-chip ${!category ? "qt-chip-active" : ""}`}
        >
          Todas
        </button>
        {[...new Set(all.map((p) => p.category))].map((c) => (
          <button
            key={c}
            onClick={() => set("categoria", c)}
            className={`qt-chip ${category === c ? "qt-chip-active" : ""}`}
          >
            {c}
          </button>
        ))}
        {collection && (
          <button className="qt-chip" onClick={() => set("colecao", "")}>
            Sair da coleção
          </button>
        )}
        <Link to="/catalogo?aba=mercados" className="qt-chip">
          Conhecer mercados
        </Link>
      </div>
      {products.isPending ||
      prices.isPending ||
      (collection && collections.isPending) ? (
        <p role="status">Buscando produtos…</p>
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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} offer={offers.get(p.id)} />
          ))}
        </div>
      ) : (
        <div className="qt-empty">
          <h2 className="font-semibold">Nenhum produto encontrado</h2>
          <p className="qt-muted mt-2">Experimente outro nome ou categoria.</p>
        </div>
      )}
    </div>
  );
}
