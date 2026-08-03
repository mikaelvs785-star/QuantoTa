import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marketService } from "@/services/marketService";

export function useCreateMarket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: marketService.criarMercado,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["mercados"] }),
  });
}
