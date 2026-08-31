import { Tags } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProdutos } from "@/hooks/useProdutos";

export function Categories() {
  const produtosQuery = useProdutos({ size: 100 });
  const categorias = [...new Set((produtosQuery.data?.content ?? []).map((produto) => produto.category).filter(Boolean))];
  return <section><SectionTitle title="Categorias disponíveis" description="Categorias dos produtos cadastrados." />{produtosQuery.isLoading ? <div className="grid grid-cols-3 gap-3 sm:grid-cols-6"><div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /><div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /></div> : categorias.length ? <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{categorias.slice(0, 6).map((categoria) => <div key={categoria} className="rounded-2xl border bg-white p-4 text-center shadow-sm dark:bg-slate-900"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15"><Tags className="size-5" /></span><span className="mt-3 block text-sm font-bold">{categoria}</span></div>)}</div> : <EmptyState title="Nenhuma categoria disponível" description="As categorias serão exibidas quando houver produtos cadastrados." action={false} />}</section>;
}
