import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useCatalogPermissions } from "@/hooks/useCatalogPermissions";
import { ApiError } from "@/components/ui/ApiError";
export function CatalogEditorRoute({
  type,
  create = false,
  children,
}: {
  type: "produto" | "mercado";
  create?: boolean;
  children: ReactNode;
}) {
  const { id } = useParams();
  const query = useCatalogPermissions();
  if (query.isPending) return <p role="status">Consultando permissões...</p>;
  if (query.isError) return <ApiError onRetry={() => void query.refetch()} />;
  const allowed =
    type === "produto"
      ? query.data.gerenciarProdutos
      : create
        ? query.data.criarMercado
        : query.data.gerenciarTodosMercados ||
          query.data.mercadosEditaveis.includes(Number(id));
  return allowed ? (
    children
  ) : (
    <p role="alert" className="qt-panel">
      Você não tem permissão para editar este registro.
    </p>
  );
}
