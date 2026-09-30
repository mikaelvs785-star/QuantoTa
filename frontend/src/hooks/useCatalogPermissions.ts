import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
export interface CatalogPermissions {
  gerenciarProdutos: boolean;
  criarMercado: boolean;
  excluirMercados: boolean;
  gerenciarTodosMercados: boolean;
  mercadosEditaveis: number[];
}
export function useCatalogPermissions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["catalogo", "permissoes", user?.id ?? "publico", user?.role],
    queryFn: async () =>
      (await api.get<CatalogPermissions>("/catalogo/permissoes")).data,
  });
}
