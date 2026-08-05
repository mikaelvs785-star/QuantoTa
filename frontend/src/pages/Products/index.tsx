import { ChevronLeft, ChevronRight, PackagePlus } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DeleteProductDialog } from "@/components/products/DeleteProductDialog";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductEmptyState } from "@/components/products/ProductEmptyState";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";
import { ProductTable } from "@/components/products/ProductTable";
import { useExcluirProduto } from "@/hooks/useExcluirProduto";
import { useProdutos } from "@/hooks/useProdutos";
import type { Product, ProductSort, ProductStatus } from "@/types/product";

const PAGE_SIZE = 10;

function getSafeTime(value?: string) {
  const parsed = new Date(value ?? "");
  return Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
}

export default function Products() {
  const productsQuery = useProdutos();
  const removeProduct = useExcluirProduto();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ProductStatus | "ALL">("ALL");
  const [sort, setSort] = useState<ProductSort>("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);
  const filtered = useMemo(() => {
    const products = productsQuery.data?.content ?? [];
    const result = products.filter((product) => (!search || product.name.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"))) && (!category || product.category === category) && (status === "ALL" || product.status === status));
    return result.sort((first, second) => sort === "az" ? first.name.localeCompare(second.name) : sort === "za" ? second.name.localeCompare(first.name) : sort === "oldest" ? getSafeTime(first.updatedAt) - getSafeTime(second.updatedAt) : getSafeTime(second.updatedAt) - getSafeTime(first.updatedAt));
  }, [productsQuery.data, search, category, status, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const displayed = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function updateFilters(values: { search?: string; category?: string; status?: ProductStatus | "ALL"; sort?: ProductSort }) { if (values.search !== undefined) setSearch(values.search); if (values.category !== undefined) setCategory(values.category); if (values.status !== undefined) setStatus(values.status); if (values.sort !== undefined) setSort(values.sort); setPage(1); }
  async function confirmDelete() { if (!selected) return; try { await removeProduct.mutateAsync(selected.id); toast.success("Produto removido."); setSelected(null); } catch { toast.error("Erro ao excluir produto."); } }
  if (productsQuery.isLoading) return <ProductSkeleton />;
  if (productsQuery.isError) return <ApiError onRetry={() => void productsQuery.refetch()} offline />;
  return <div className="mx-auto max-w-7xl"><SectionTitle title="Produtos" description="Gerencie os produtos que você acompanha." action={<Button asChild><Link to="/admin/produtos/novo"><PackagePlus className="size-4" /> Novo produto</Link></Button>} /><ProductFilters search={search} category={category} status={status} sort={sort} onChange={updateFilters} /><div className="mt-5">{filtered.length ? <><ProductTable products={displayed} onDelete={setSelected} /><div className="space-y-3 md:hidden">{displayed.map((product) => <ProductCard key={product.id} product={product} onDelete={setSelected} />)}</div><div className="mt-5 flex items-center justify-between text-sm"><p className="text-slate-500">{filtered.length} produto{filtered.length === 1 ? "" : "s"}</p><div className="flex items-center gap-2"><Button variant="outline" size="sm" aria-label="Página anterior" disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="size-4" /> Anterior</Button><span className="text-xs text-slate-500">Página {page} de {pageCount}</span><Button variant="outline" size="sm" aria-label="Próxima página" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Próxima <ChevronRight className="size-4" /></Button></div></div></> : <ProductEmptyState />}</div><DeleteProductDialog product={selected} loading={removeProduct.isPending} onConfirm={() => void confirmDelete()} onClose={() => setSelected(null)} /></div>;
}

