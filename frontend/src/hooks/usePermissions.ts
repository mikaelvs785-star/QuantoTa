import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
export interface Permissions {
  gerenciarProdutos: boolean;
  criarMercado: boolean;
  excluirMercados: boolean;
  gerenciarTodosMercados: boolean;
  mercadosEditaveis: number[];
  gerenciarPrecos: boolean;
  gerenciarTodosPrecos: boolean;
  mercadosPrecosEditaveis: number[];
  gerenciarUsuarios: boolean;
  usarListas: boolean;
  acessarConta: boolean;
}
export function usePermissions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["permissoes", user?.id ?? "publico"],
    queryFn: async () => (await api.get<Permissions>("/permissoes")).data,
  });
}
