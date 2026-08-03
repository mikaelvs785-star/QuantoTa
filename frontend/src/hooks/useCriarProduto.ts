import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produtoService } from "@/services/produtoService";
export function useCriarProduto() { const client = useQueryClient(); return useMutation({ mutationFn: produtoService.criarProduto, onSuccess: () => void client.invalidateQueries({ queryKey: ["produtos"] }) }); }
