import { useQuery } from "@tanstack/react-query";
import { marketService } from "@/services/marketService";
import type { MarketListParams } from "@/types/market";

export function useMarkets(params: MarketListParams = {}) {
  return useQuery({ queryKey: ["mercados", params], queryFn: () => marketService.listarMercados(params) });
}
