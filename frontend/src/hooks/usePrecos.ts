import { useQuery } from "@tanstack/react-query";
import { getPrecos } from "@/services/dashboard";
export function usePrecos() {
  return useQuery({ queryKey: ["precos"], queryFn: () => getPrecos() });
}

export function usePrecosAtuais() {
  return useQuery({
    queryKey: ["precos", "atuais"],
    queryFn: () => getPrecos(true),
  });
}
