import { useQuery } from "@tanstack/react-query";
import { getMercados } from "@/services/dashboard";
export function useMercados() { return useQuery({ queryKey: ["mercados"], queryFn: getMercados }); }
