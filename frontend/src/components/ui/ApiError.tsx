import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "./Button";

export function ApiError({ onRetry, offline = false }: { onRetry: () => void; offline?: boolean }) {
  return <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center"><span className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/15"><WifiOff className="size-6" /></span><h2 className="mt-4 font-bold">{offline ? "Sem conexão com a API" : "Não foi possível carregar os dados"}</h2><p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">Verifique se o backend está disponível e tente novamente.</p><Button variant="outline" size="sm" className="mt-4" onClick={onRetry}><RefreshCw className="size-4" /> Tentar novamente</Button></div>;
}
