import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produtoService } from "@/services/produtoService";
export function useExcluirProduto() { const client = useQueryClient(); return useMutation({ mutationFn: produtoService.excluirProduto, onSuccess: () => void client.invalidateQueries({ queryKey: ["produtos"] }) }); }
