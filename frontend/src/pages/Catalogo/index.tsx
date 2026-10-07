import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProductImage } from "@/components/storefront/Media";
import { useAuth } from "@/hooks/useAuth";
import { Fragment, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Package, Store, Plus, Search, Pencil } from "lucide-react";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecos } from "@/hooks/usePrecos";
import { useMarkets } from "@/hooks/useMarkets";
import { usePermissions } from "@/hooks/usePermissions";
import { useExcluirProduto } from "@/hooks/useExcluirProduto";
import { useDeleteMarket } from "@/hooks/useDeleteMarket";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DeleteProductDialog } from "@/components/products/DeleteProductDialog";
import { DeleteMarketDialog } from "@/components/markets/DeleteMarketDialog";
import type { Product } from "@/types/product";
import type { Market } from "@/types/market";

const PAGE_SIZE = 12;
export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const marketsTab = params.get("aba") === "mercados";
  const search = params.get("busca") ?? params.get("q") ?? "";
  const { user } = useAuth();
  const seller = user?.role === "VENDEDOR";
  const offers = usePrecos(seller);
  const products = useProdutos({}, seller);
  const markets = useMarkets({}, seller);
  const ownMarketId = seller ? ((markets.data?.content ?? []).find(m => m.id === params.get("mercado"))?.id ?? markets.data?.content[0]?.id ?? "") : "";
  const marketOffers = (offers.data ?? []).filter(offer => !seller || offer.marketId === ownMarketId);
  const productIds = new Set(marketOffers.map(offer => offer.productId));
  const photos = new Map<string, string>();
  [...marketOffers].sort((a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id)).forEach(offer => {
    if (offer.imageId && !photos.has(offer.productId)) photos.set(offer.productId, offer.imageId);
  });
  const client = useQueryClient();
  const [removal, setRemoval] = useState<{ product: Product; marketId: string; market: string }>();
  const removeOffer = useMutation({
    mutationFn: (selection: NonNullable<typeof removal>) => api.delete(`/precos/mercado/${selection.marketId}/produto/${selection.product.id}`),
    onSuccess: async () => {
      setRemoval(undefined);
      await Promise.all(["produtos", "precos", "embalagens", "resumo-lista", "dashboard"].map(key => client.invalidateQueries({ queryKey: [key] })));
      toast.success("Produto removido deste mercado.");
    },
    onError: () => toast.error("Não foi possível remover o produto. Tente novamente."),
  });
  const permissions = usePermissions();
  const removeProduct = useExcluirProduto();
  const removeMarket = useDeleteMarket();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const grants = permissions.data;
  const editableMarkets = new Set(grants?.mercadosEditaveis.map(String));
  const matches = (text: string) =>
    text.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"));
  const category = params.get("categoria") ?? "";
  const status = params.get("situacao") ?? "";
  const categories = [...new Set((products.data?.content ?? []).map(p => p.category))].sort();
  const shownProducts = (products.data?.content ?? []).filter((p) =>
    matches(`${p.name} ${p.brand ?? ""} ${p.category} ${p.unit ?? ""}`) && (!category || p.category === category) && (!status || p.status === status) && (!seller || productIds.has(p.id)),
  ).sort((a, b) => a.category.localeCompare(b.category, "pt-BR") || a.name.localeCompare(b.name, "pt-BR"));
  const shownMarkets = (markets.data?.content ?? []).filter((m) =>
    matches(`${m.name} ${m.city} ${m.neighborhood ?? ""}`) && (!status || m.status === status),
  );
  const count = marketsTab ? shownMarkets.length : shownProducts.length;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get("pagina")) || 1), pages);
  function change(values: Record<string, string>) {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) => next.set(key, value));
    setParams(next, { replace: true });
  }
  async function confirmDelete() {
    try {
      if (selectedProduct) await removeProduct.mutateAsync(selectedProduct.id);
      if (selectedMarket) await removeMarket.mutateAsync(selectedMarket.id);
      setSelectedProduct(null);
      setSelectedMarket(null);
      toast.success("Registro desativado.");
    } catch {
      toast.error("Não foi possível desativar o registro.");
    }
  }
  const query = marketsTab ? markets : products;
  const visibleProducts = shownProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title={seller ? "Meu mercado e meus produtos" : "Catálogo"}
        description={grants?.gerenciarPrecos ? "Organize o catálogo e mantenha os cadastros em dia." : "Encontre produtos e estabelecimentos para planejar sua compra."}
        action={(marketsTab ? grants?.criarMercado : grants?.gerenciarProdutos) ? <Button asChild><Link to={marketsTab ? "/mercados/novo" : "/produtos/novo"}><Plus className="size-4" />Novo {marketsTab ? "mercado" : "produto"}</Link></Button> : undefined}
      />
      <nav
        aria-label="Seções do catálogo"
        className="mb-6 flex flex-wrap gap-3"
      >
        <Button
          variant={marketsTab ? "outline" : "primary"}
          aria-current={!marketsTab ? "page" : undefined}
          onClick={() => change({ aba: "produtos", pagina: "1" })}
        >
          <Package className="size-4" /> Produtos <span className="ml-1 opacity-70">{products.data?.total ?? "—"}</span>
        </Button>
        <Button
          variant={marketsTab ? "primary" : "outline"}
          aria-current={marketsTab ? "page" : undefined}
          onClick={() => change({ aba: "mercados", pagina: "1" })}
        >
          <Store className="size-4" /> Mercados <span className="ml-1 opacity-70">{markets.data?.total ?? "—"}</span>
        </Button>
      </nav>
      {seller && !marketsTab && <section className="mb-5 rounded-2xl border bg-white p-4 dark:bg-slate-900">
        <label className="block"><span className="mb-2 flex items-center gap-2 font-semibold"><Store className="size-4" />Mercado que você está gerenciando</span>
          <select className="qt-select" value={ownMarketId} disabled={markets.isPending} onChange={e => change({ mercado: e.target.value, pagina: "1" })}>
            {!markets.data?.content.length && <option value="">Nenhum mercado vinculado</option>}
            {markets.data?.content.map(m => <option key={m.id} value={m.id}>{m.name}{m.status === "INACTIVE" ? " (inativo)" : ""}</option>)}
          </select>
        </label><p className="qt-muted mt-2 text-sm">Produtos e fotos das ofertas deste mercado, organizados por categoria.</p>
      </section>}
      <div className="mb-5 grid gap-4 rounded-2xl border bg-white p-4 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_150px]">
        <label className="min-w-0 sm:col-span-2 lg:col-span-1">
          <span className="mb-2 block text-sm font-semibold">Buscar {marketsTab ? "mercado" : "produto"}</span>
          <div className="relative"><Search className="absolute left-3 top-3 size-4 text-slate-400" aria-hidden="true" />
            <Input className="pl-10" placeholder={marketsTab ? "Nome, cidade ou bairro" : "Nome, marca ou embalagem"} value={search} onChange={e => change({ busca: e.target.value, pagina: "1" })} />
          </div>
        </label>
        {!marketsTab && <label><span className="mb-2 block text-sm font-semibold">Categoria</span>
          <select className="qt-select" value={category} onChange={e => change({ categoria: e.target.value, pagina: "1" })}>
            <option value="">Todas as categorias</option>{categories.map(value => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>}
        <label><span className="mb-2 block text-sm font-semibold">Situação</span>
          <select className="qt-select" value={status} onChange={e => change({ situacao: e.target.value, pagina: "1" })}>
            <option value="">Todos</option><option value="ACTIVE">Ativos</option><option value="INACTIVE">Inativos</option>
          </select>
        </label>
      </div>
      {(search || category || status) && <div className="mb-4 flex items-center justify-between gap-3 text-sm"><p className="qt-muted">{count} resultados encontrados</p><button className="font-semibold underline" onClick={() => change({ busca: "", q: "", categoria: "", situacao: "", pagina: "1" })}>Limpar filtros</button></div>}
      {permissions.isError && (
        <p role="status" className="qt-muted mb-4">
          Não foi possível consultar suas permissões.{" "}
          <button
            className="underline"
            onClick={() => void permissions.refetch()}
          >
            Tentar novamente
          </button>
        </p>
      )}
      {query.isPending || (seller && !marketsTab && (offers.isPending || markets.isPending)) ? (
        <p role="status">Carregando catálogo...</p>
      ) : query.isError || (seller && !marketsTab && (offers.isError || markets.isError)) ? (
        <ApiError onRetry={() => { void query.refetch(); void offers.refetch(); void markets.refetch(); }} />
      ) : !count ? (
        <p className="qt-empty">
          Nenhum {marketsTab ? "mercado" : "produto"} encontrado.
        </p>
      ) : (
        <>
          <div className={marketsTab ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
            {marketsTab
              ? shownMarkets
                  .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                  .map((market) => (
                    <article key={market.id} className="qt-panel">
                      <ProductImage id={market.imageId} alt={market.name} className="mb-4 h-40 w-full rounded-xl"/><h2 className="text-xl font-semibold">{market.name}</h2>
                      <p className="qt-muted mt-2">
                        {[
                          market.address,
                          market.neighborhood,
                          market.city,
                          market.state,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "Endereço não informado"}
                      </p>
                      <p className="qt-muted mt-2">
                        {market.phone || "Telefone não informado"}
                      </p>
                      {market.status === "INACTIVE" && (
                        <p className="mt-2 text-sm">Inativo</p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(grants?.gerenciarTodosMercados ||
                          (editableMarkets.has(market.id) &&
                            market.status === "ACTIVE")) && (
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/mercados/${market.id}/editar`}>
                              Editar
                            </Link>
                          </Button>
                        )}
                        {grants?.excluirMercados &&
                          (grants.gerenciarTodosMercados || editableMarkets.has(market.id)) &&
                          market.status === "ACTIVE" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMarket(market)}
                            >
                              Desativar
                            </Button>
                          )}
                      </div>
                    </article>
                  ))
              : visibleProducts.map((product, index) => (
                    <Fragment key={product.id}>
                    {(index === 0 || visibleProducts[index - 1].category !== product.category) && <div className="flex items-center gap-3 pb-2 pt-5 first:pt-0"><h2 className="text-lg font-bold text-brand-700 dark:text-brand-100">{product.category}</h2><span className="rounded-full bg-brand-50 px-2 py-1 text-xs text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">{shownProducts.filter(p => p.category === product.category).length}</span><div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /></div>}
                    <article key={product.id} className="flex flex-col gap-4 rounded-2xl border bg-white p-4 dark:bg-slate-900 xl:flex-row xl:items-center xl:justify-between sm:px-5">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800">
                          {photos.get(product.id) ? <ProductImage id={photos.get(product.id)} alt={product.name} className="h-full w-full" /> : <span className="flex h-full items-center justify-center px-1 text-center text-[10px] text-slate-500">{offers.isPending ? "Carregando…" : offers.isError ? "Foto indisponível" : "Sem foto"}</span>}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{product.name}</h2>
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-slate-800">{product.unit || "Embalagem não informada"}</span>
                          </div>
                          <p className="qt-muted mt-1 text-sm">{product.brand || "Marca não informada"} · {product.category}</p>
                          {product.description && <details className="qt-muted mt-2 text-xs"><summary className="cursor-pointer">Descrição do produto</summary><p className="mt-2 max-w-xl leading-relaxed">{product.description}</p></details>}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <span className={`mr-2 rounded-full px-2 py-1 text-xs font-semibold ${product.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"}`}>{product.status === "ACTIVE" ? "Ativo" : "Inativo"}</span>

                        <Button asChild variant="outline" size="sm">
                          <Link to={`/comparar?produto=${product.id}`}>
                            Comparar preços
                          </Link>
                        </Button>
                        {seller && ownMarketId && <Button variant="outline" size="sm" className="text-red-600" disabled={removeOffer.isPending} onClick={() => setRemoval({ product, marketId: ownMarketId, market: markets.data?.content.find(m => m.id === ownMarketId)?.name ?? "seu mercado" })}>Remover do mercado</Button>}
                        {grants?.gerenciarProdutos && (
                          <>
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/produtos/${product.id}/editar`}>
                                <Pencil className="size-3.5" /> Editar
                              </Link>
                            </Button>
                            {product.status === "ACTIVE" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setSelectedProduct(product)}
                              >
                                Desativar
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </article>
                    </Fragment>
                  ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="qt-muted">
              {count} {marketsTab ? "mercados" : "produtos"}
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => change({ pagina: String(page - 1) })}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {page} de {pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                onClick={() => change({ pagina: String(page + 1) })}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
      <ConfirmDialog open={Boolean(removal)} title="Remover produto definitivamente?"
        message={`Todos os preços, histórico e a foto da oferta de ${removal?.product.name ?? "este produto"} em ${removal?.market ?? "este mercado"} serão removidos. Esta ação não pode ser desfeita e não afeta outros mercados.`}
        confirmLabel="Remover definitivamente" loading={removeOffer.isPending}
        onClose={() => { if (!removeOffer.isPending) setRemoval(undefined); }}
        onConfirm={() => { if (removal) removeOffer.mutate(removal); }} />
      <DeleteProductDialog
        product={selectedProduct}
        loading={removeProduct.isPending}
        onConfirm={() => void confirmDelete()}
        onClose={() => setSelectedProduct(null)}
      />
      <DeleteMarketDialog
        market={selectedMarket}
        loading={removeMarket.isPending}
        onConfirm={() => void confirmDelete()}
        onClose={() => setSelectedMarket(null)}
      />
    </div>
  );
}
