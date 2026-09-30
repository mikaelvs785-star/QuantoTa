import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { marketService } from "@/services/marketService";
import type { MarketListParams } from "@/types/market";

export function useMarkets(params: MarketListParams = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["mercados", user?.id ?? "publico", user?.role, params],
    queryFn: () => marketService.listarMercados(params),
  });
}
