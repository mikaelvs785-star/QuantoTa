import { useQuery } from "@tanstack/react-query";
import { produtoService } from "@/services/produtoService";
import type { ProductListParams } from "@/types/product";

export function useProdutos(params: ProductListParams = {}) {
  return useQuery({ queryKey: ["produtos", params], queryFn: () => produtoService.listarProdutos(params) });
}
