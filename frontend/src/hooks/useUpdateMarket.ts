import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marketService } from "@/services/marketService";
import type { MarketInput } from "@/types/market";

export function useUpdateMarket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MarketInput }) => marketService.editarMercado(id, input),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["mercados"] });
      void queryClient.invalidateQueries({ queryKey: ["mercado", variables.id] });
    },
  });
}
