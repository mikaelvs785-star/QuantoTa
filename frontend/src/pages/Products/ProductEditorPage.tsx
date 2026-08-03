import toast from "react-hot-toast";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";
import { useCriarProduto } from "@/hooks/useCriarProduto";
import { useEditarProduto } from "@/hooks/useEditarProduto";
import { useProduto } from "@/hooks/useProduto";
import type { ProductInput } from "@/types/product";

export function ProductEditorPage({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const productQuery = useProduto(id);
  const createProduct = useCriarProduto();
  const editProduct = useEditarProduto();
  const isEdit = mode === "edit";
  if (isEdit && productQuery.isLoading) return <ProductSkeleton />;
  if (isEdit && productQuery.isError) return <ApiError onRetry={() => void productQuery.refetch()} />;
  if (isEdit && !productQuery.data) return <Navigate to="/produtos" replace />;
  async function submit(input: ProductInput) { try { if (isEdit) { await editProduct.mutateAsync({ id, input }); toast.success("Produto atualizado."); navigate(`/produtos/${id}`); } else { const product = await createProduct.mutateAsync(input); toast.success("Produto criado."); navigate(`/produtos/${product.id}`); } } catch { toast.error("Erro ao salvar produto."); } }
  return <div className="mx-auto max-w-3xl"><SectionTitle title={isEdit ? "Editar produto" : "Novo produto"} description={isEdit ? "Atualize as informações do produto." : "Cadastre um produto para comparar preços."} action={<Button asChild variant="outline"><Link to="/produtos">Cancelar</Link></Button>} /><Card><CardContent className="p-5 sm:p-7"><ProductForm product={productQuery.data} submitting={createProduct.isPending || editProduct.isPending} onSubmit={(input) => void submit(input)} /></CardContent></Card></div>;
}
