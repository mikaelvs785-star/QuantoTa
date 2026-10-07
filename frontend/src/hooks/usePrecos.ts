import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getPrecos } from "@/services/dashboard";
export function usePrecos(gestao = false) {
  const { user } = useAuth();
  return useQuery({ queryKey: ["precos", user?.id ?? "publico", gestao], queryFn: () => getPrecos(false, gestao) });
}

export function usePrecosAtuais() {
  return useQuery({
    queryKey: ["precos", "atuais"],
    queryFn: () => getPrecos(true),
  });
}
