import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produtoService } from "@/services/produtoService";
import type { ProductInput } from "@/types/product";
export function useEditarProduto() { const client = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id: string; input: ProductInput }) => produtoService.editarProduto(id, input), onSuccess: (_, variables) => { void client.invalidateQueries({ queryKey: ["produtos"] }); void client.invalidateQueries({ queryKey: ["produto", variables.id] }); } }); }
