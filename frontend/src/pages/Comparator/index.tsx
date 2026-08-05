import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Search, ShoppingBasket, Store, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useProdutos } from "@/hooks/useProdutos";
import { useMercados } from "@/hooks/useMercados";
import { usePrecos } from "@/hooks/usePrecos";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ComparadorPage() {
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { data: productData, isPending: productsLoading } = useProdutos({ size: 100 });
  const { data: markets = [], isPending: marketsLoading } = useMercados();
  const { data: prices = [], isPending: pricesLoading } = usePrecos();

  const products = productData?.content ?? [];

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) => product.name.toLowerCase().includes(query));
  }, [products, search]);

  useEffect(() => {
    if (!filteredProducts.length) {
      setSelectedProductId(null);
      return;
    }

    if (!selectedProductId || !filteredProducts.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(filteredProducts[0].id);
    }
  }, [filteredProducts, selectedProductId]);

  const selectedProduct = filteredProducts.find((product) => product.id === selectedProductId) ?? filteredProducts[0] ?? null;

  const comparisonRows = useMemo(() => {
    if (!selectedProduct) return [];

    return prices
      .filter((price) => price.product.toLowerCase() === selectedProduct.name.toLowerCase())
      .map((price) => ({
        id: price.id,
        market: price.market,
        price: price.price,
        date: price.date,
      }))
      .sort((left, right) => left.price - right.price);
  }, [prices, selectedProduct]);

  const cheapestPrice = comparisonRows[0]?.price ?? 0;
  const highestPrice = comparisonRows[comparisonRows.length - 1]?.price ?? 0;
  const savings = Math.max(highestPrice - cheapestPrice, 0);
  const marketCount = new Set(comparisonRows.map((row) => row.market)).size;

  const cards = [
    { title: "Produto", value: selectedProduct?.name ?? "—", icon: ShoppingBasket, tone: "text-blue-600" },
    { title: "Menor preço", value: cheapestPrice ? formatCurrency(cheapestPrice) : "—", icon: Tags, tone: "text-emerald-600" },
    { title: "Economia", value: savings ? formatCurrency(savings) : "—", icon: ArrowDownRight, tone: "text-amber-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle title="Comparador" description="Compare produtos e mercados em um único painel." />

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="overflow-hidden border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/80">
              <CardContent className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Icon className={`size-5 ${card.tone}`} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{card.title}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardContent className="space-y-5 p-5 md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10"
                placeholder="Busque um produto para comparar"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setSearch("")}>
              Limpar busca
            </Button>
          </div>

          <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Produtos encontrados</p>
                <span className="text-xs text-slate-500">{filteredProducts.length}</span>
              </div>

              {productsLoading ? (
                <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-500">Carregando produtos...</div>
              ) : filteredProducts.length ? (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => setSelectedProductId(product.id)}
                      className={`w-full rounded-2xl border px-3 py-3 text-left transition ${selectedProduct?.id === product.id ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10" : "bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"}`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState title="Nenhum produto encontrado" description="Tente outro termo para localizar itens na comparação." action={false} />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40">
                <span className="grid size-10 place-items-center rounded-xl bg-white text-brand-600 shadow-sm dark:bg-slate-900">
                  <ShoppingBasket className="size-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Produto selecionado</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{selectedProduct?.name ?? "Nenhum produto"}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Card className="border-emerald-100 bg-emerald-50/60 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Mercados ativos</p>
                    <p className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-200">{marketCount}</p>
                  </CardContent>
                </Card>

                <Card className="border-amber-100 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/10">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-300">Maior diferença</p>
                    <p className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-200">{formatCurrency(savings)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-0">
                  {pricesLoading || marketsLoading ? (
                    <div className="p-6 text-sm text-slate-500">Carregando comparação...</div>
                  ) : comparisonRows.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px] text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Mercado</th>
                            <th className="px-4 py-3 font-semibold">Preço</th>
                            <th className="px-4 py-3 font-semibold">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonRows.map((row, index) => (
                            <tr key={`${row.id}-${row.market}`} className="border-b border-slate-200 last:border-0 dark:border-slate-700">
                              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                <div className="flex items-center gap-2">
                                  <Store className="size-4 text-slate-400" />
                                  {row.market}
                                  {index === 0 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Menor</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{formatCurrency(row.price)}</td>
                              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(row.date))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6">
                      <EmptyState title="Sem preços para esse produto" description="Cadastre preços em algum mercado para ver a comparação detalhada." action={false} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ArrowUpRight className="size-4 text-emerald-600" />
                {markets.length} mercados disponíveis na base
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
