import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { produtoService } from "@/services/produtoService";
import type { ProductListParams } from "@/types/product";

export function useProdutos(params: ProductListParams = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["produtos", user?.id ?? "publico", user?.role, params],
    queryFn: () => produtoService.listarProdutos(params),
  });
}
