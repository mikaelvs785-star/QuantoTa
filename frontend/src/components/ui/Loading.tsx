import { LoaderCircle } from "lucide-react";

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"><LoaderCircle className="size-5 animate-spin" />{label}</div>;
}
