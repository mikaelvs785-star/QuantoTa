import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marketService } from "@/services/marketService";

export function useDeleteMarket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketService.excluirMercado(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["mercados"] }),
  });
}
