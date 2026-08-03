import { useQuery } from "@tanstack/react-query";
import { produtoService } from "@/services/produtoService";
export function useProduto(id: string) { return useQuery({ queryKey: ["produto", id], queryFn: () => produtoService.buscarProduto(id), enabled: Boolean(id) }); }
