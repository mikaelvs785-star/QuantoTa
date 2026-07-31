import { useQuery } from "@tanstack/react-query";
import { getPrecos } from "@/services/dashboard";
export function usePrecos() { return useQuery({ queryKey: ["precos"], queryFn: getPrecos }); }
