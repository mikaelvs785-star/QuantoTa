import { useQuery } from "@tanstack/react-query";
import { marketService } from "@/services/marketService";

export function useMarket(id: string) {
  return useQuery({ queryKey: ["mercado", id], queryFn: () => marketService.buscarMercado(id), enabled: Boolean(id) });
}
