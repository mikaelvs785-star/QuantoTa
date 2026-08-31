import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useMercados } from "@/hooks/useMercados";

export function Markets() {
  const mercadosQuery = useMercados();
  const mercados = mercadosQuery.data ?? [];
  return <section><SectionTitle title="Mercados cadastrados" description="Estabelecimentos disponíveis para comparação." />{mercadosQuery.isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /><div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /></div> : mercados.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{mercados.slice(0, 4).map((mercado) => <Card key={mercado.id}><CardContent className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-brand-600 font-black text-white">{mercado.name.slice(0, 1)}</span><div className="min-w-0"><h3 className="truncate font-bold">{mercado.name}</h3><Link to="/dashboard" className="mt-1 flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600"><MapPin className="size-3" /> Ver preços cadastrados</Link></div></CardContent></Card>)}</div> : <Card><EmptyState title="Nenhum mercado cadastrado" description="Os mercados aparecerão aqui quando forem cadastrados pela administração." action={false} /></Card>}</section>;
}
