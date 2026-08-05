import { useMemo, useState } from "react";
import { CircleDollarSign, PackagePlus, Plus, Search, ShoppingBasket, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecos } from "@/hooks/usePrecos";
import { formatCurrency } from "@/lib/utils";

type ShoppingItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  market: string;
};

export default function ListaPage() {
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<ShoppingItem[]>([]);

  const { data: productData, isPending: productsLoading } = useProdutos({ size: 100 });
  const { data: prices = [], isPending: pricesLoading } = usePrecos();

  const products = productData?.content ?? [];

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => product.name.toLowerCase().includes(query));
  }, [products, search]);

  const bestOfferByProduct = useMemo(() => {
    const map = new Map<string, { market: string; price: number }>();

    prices.forEach((price) => {
      const key = price.product.toLowerCase();
      const current = map.get(key);

      if (!current || price.price < current.price) {
        map.set(key, { market: price.market, price: price.price });
      }
    });

    return map;
  }, [prices]);

  const selectedProduct = filteredProducts.find((product) => product.id === selectedProductId) ?? filteredProducts[0] ?? null;

  const selectedOffer = selectedProduct ? bestOfferByProduct.get(selectedProduct.name.toLowerCase()) : undefined;
  const selectedUnitPrice = selectedOffer?.price ?? 0;
  const selectedMarket = selectedOffer?.market ?? "Sem mercado cadastrado";

  const addItemToList = () => {
    if (!selectedProduct) return;

    const offer = bestOfferByProduct.get(selectedProduct.name.toLowerCase());

    setItems((current) => [
      {
        id: `${selectedProduct.id}-${Date.now()}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        unitPrice: offer?.price ?? 0,
        market: offer?.market ?? "Sem mercado cadastrado",
      },
      ...current,
    ]);
  };

  const updateQuantity = (id: string, nextQuantity: number) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, nextQuantity) } : item)));
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const totalEstimate = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const marketsInList = new Set(items.map((item) => item.market)).size;

  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle title="Lista de Compras" description="Organize sua compra com foco em economia." />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/80">
          <CardContent className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <ShoppingBasket className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Itens na lista</p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{totalItems}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/80">
          <CardContent className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <CircleDollarSign className="size-5 text-emerald-600" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Estimativa</p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalEstimate)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/80">
          <CardContent className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <PackagePlus className="size-5 text-blue-600" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Mercados</p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{marketsInList}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="space-y-5 p-5 md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_140px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10"
                placeholder="Busque um produto para adicionar"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            />

            <Button onClick={addItemToList} disabled={!selectedProduct}>
              <Plus className="size-4" />
              Adicionar
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Produtos disponíveis</p>
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
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setQuantity(1);
                      }}
                      className={`w-full rounded-2xl border px-3 py-3 text-left transition ${selectedProduct?.id === product.id ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10" : "bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"}`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState title="Nenhum produto encontrado" description="Tente outra busca para montar sua lista." action={false} />
              )}
            </div>

            <div className="space-y-4">
              <Card className="border-slate-200/80 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Produto selecionado</p>
                  <p className="mt-2 text-lg font-black text-slate-900 dark:text-slate-100">{selectedProduct?.name ?? "—"}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Melhor preço</p>
                      <p className="mt-1 font-bold text-emerald-600">{selectedUnitPrice ? formatCurrency(selectedUnitPrice) : "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Mercado</p>
                      <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">{selectedMarket}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  {pricesLoading ? (
                    <div className="p-6 text-sm text-slate-500">Carregando preços...</div>
                  ) : items.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Produto</th>
                            <th className="px-4 py-3 font-semibold">Mercado</th>
                            <th className="px-4 py-3 font-semibold">Qtd.</th>
                            <th className="px-4 py-3 font-semibold">Preço unit.</th>
                            <th className="px-4 py-3 font-semibold">Total</th>
                            <th className="px-4 py-3 text-right font-semibold">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item.id} className="border-b border-slate-200 last:border-0 dark:border-slate-700">
                              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{item.productName}</td>
                              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.market}</td>
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  className="w-20"
                                  onChange={(event) => updateQuantity(item.id, Number(event.target.value) || 1)}
                                />
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-4 py-3 font-bold text-emerald-600">{formatCurrency(item.quantity * item.unitPrice)}</td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.productName}`}>
                                  <Trash2 className="size-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6">
                      <EmptyState title="Sua lista está vazia" description="Adicione itens a partir dos produtos disponíveis para montar a compra." action={false} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
