import { ProductImage } from "@/components/storefront/Media";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Package, Store } from "lucide-react";
import { useProdutos } from "@/hooks/useProdutos";
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
  const products = useProdutos({}, seller);
  const markets = useMarkets({}, seller);
  const permissions = usePermissions();
  const removeProduct = useExcluirProduto();
  const removeMarket = useDeleteMarket();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const grants = permissions.data;
  const editableMarkets = new Set(grants?.mercadosEditaveis.map(String));
  const matches = (text: string) =>
    text.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"));
  const shownProducts = (products.data?.content ?? []).filter((p) =>
    matches(`${p.name} ${p.brand ?? ""} ${p.category}`),
  );
  const shownMarkets = (markets.data?.content ?? []).filter((m) =>
    matches(`${m.name} ${m.city} ${m.neighborhood ?? ""}`),
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
  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title={seller ? "Meu mercado e meus produtos" : "Catálogo"}
        description="Encontre produtos e estabelecimentos para planejar sua compra."
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
          <Package className="size-4" /> Produtos
        </Button>
        <Button
          variant={marketsTab ? "primary" : "outline"}
          aria-current={marketsTab ? "page" : undefined}
          onClick={() => change({ aba: "mercados", pagina: "1" })}
        >
          <Store className="size-4" /> Mercados
        </Button>
      </nav>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="min-w-0 flex-1">
          <span className="mb-2 block text-sm font-semibold">
            Buscar{" "}
            {marketsTab
              ? "mercado, cidade ou bairro"
              : "produto, marca ou categoria"}
          </span>
          <Input
            value={search}
            onChange={(e) => change({ busca: e.target.value, pagina: "1" })}
          />
        </label>
        {(marketsTab ? grants?.criarMercado : grants?.gerenciarProdutos) && (
          <Button asChild>
            <Link to={marketsTab ? "/mercados/novo" : "/produtos/novo"}>
              Novo {marketsTab ? "mercado" : "produto"}
            </Link>
          </Button>
        )}
      </div>
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
      {query.isPending ? (
        <p role="status">Carregando catálogo...</p>
      ) : query.isError ? (
        <ApiError onRetry={() => void query.refetch()} />
      ) : !count ? (
        <p className="qt-empty">
          Nenhum {marketsTab ? "mercado" : "produto"} encontrado.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
              : shownProducts
                  .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                  .map((product) => (
                    <article key={product.id} className="qt-panel">
                      <h2 className="text-xl font-semibold">{product.name}</h2>
                      <p className="qt-muted mt-2">
                        {[product.brand, product.unit, product.category]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {product.description && (
                        <p className="qt-muted mt-2">{product.description}</p>
                      )}
                      {product.status === "INACTIVE" && (
                        <p className="mt-2 text-sm">Inativo</p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/comparar?produto=${product.id}`}>
                            Comparar preços
                          </Link>
                        </Button>
                        {grants?.gerenciarProdutos && (
                          <>
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/produtos/${product.id}/editar`}>
                                Editar
                              </Link>
                            </Button>
                            {product.status === "ACTIVE" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProduct(product)}
                              >
                                Desativar
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </article>
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
