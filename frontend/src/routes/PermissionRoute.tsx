import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";

type Action = "produto" | "mercado" | "usuarios" | "lista" | "conta";
export function PermissionRoute({
  action,
  create = false,
  children,
}: {
  action: Action;
  create?: boolean;
  children: ReactNode;
}) {
  const { id } = useParams();
  const query = usePermissions();
  if (query.isPending) return <p role="status">Consultando permissões...</p>;
  if (query.isError) return <ApiError onRetry={() => void query.refetch()} />;
  const grants = query.data;
  const allowed =
    action === "produto"
      ? grants.gerenciarProdutos
      : action === "mercado"
        ? create
          ? grants.criarMercado
          : grants.gerenciarTodosMercados ||
            grants.mercadosEditaveis.includes(Number(id))
        : action === "usuarios"
          ? grants.gerenciarUsuarios
          : action === "lista"
            ? grants.usarListas
            : grants.acessarConta;
  return allowed ? (
    children
  ) : (
    <section className="qt-panel mx-auto max-w-6xl" role="alert">
      <h1 className="text-2xl font-semibold">Acesso restrito</h1>
      <p className="qt-muted mt-3">
        Sua conta não tem permissão para esta ação.
      </p>
      <Button asChild variant="outline" className="mt-5">
        <Link to="/catalogo">Voltar ao catálogo</Link>
      </Button>
    </section>
  );
}
