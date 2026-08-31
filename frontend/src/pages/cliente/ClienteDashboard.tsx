import { ArrowRight, CircleDollarSign, Package, ScanSearch, Store, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useMercados } from "@/hooks/useMercados";
import { usePrecos } from "@/hooks/usePrecos";
import { useProdutos } from "@/hooks/useProdutos";
import { formatCurrency } from "@/lib/utils";

export default function ClienteDashboard() {
  const produtosQuery = useProdutos({ size: 100 });
  const mercadosQuery = useMercados();
  const precosQuery = usePrecos();

  const produtos = produtosQuery.data?.content ?? [];
  const mercados = mercadosQuery.data ?? [];
  const precos = precosQuery.data ?? [];

  const comparacoes = useMemo(() => produtos.flatMap((produto) => {
    const menoresPrecosPorMercado = new Map<string, typeof precos[number]>();

    precos
      .filter((preco) => preco.productId === produto.id && preco.marketId)
      .forEach((preco) => {
        const atual = menoresPrecosPorMercado.get(preco.marketId!);
        if (!atual || preco.price < atual.price) menoresPrecosPorMercado.set(preco.marketId!, preco);
      });

    const ofertas = [...menoresPrecosPorMercado.values()].sort((a, b) => a.price - b.price);
    if (ofertas.length < 2) return [];

    const menorPreco = ofertas[0];
    const maiorPreco = ofertas[ofertas.length - 1];

    return [{
      produto,
      menorPreco,
      diferenca: maiorPreco.price - menorPreco.price,
      mercados: ofertas.length,
    }];
  }).sort((a, b) => b.diferenca - a.diferenca), [precos, produtos]);

  const carregando = produtosQuery.isLoading || mercadosQuery.isLoading || precosQuery.isLoading;
  const comErro = produtosQuery.isError || mercadosQuery.isError || precosQuery.isError;

  if (carregando) {
    return <div className="mx-auto max-w-7xl space-y-5"><div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /><div className="grid gap-4 md:grid-cols-3"><div className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /><div className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /><div className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /></div></div>;
  }

  if (comErro) {
    return <ApiError onRetry={() => { void produtosQuery.refetch(); void mercadosQuery.refetch(); void precosQuery.refetch(); }} offline />;
  }

  const indicadores = [
    { label: "Produtos disponíveis", value: produtos.length, icon: Package, tone: "text-blue-600" },
    { label: "Mercados cadastrados", value: mercados.length, icon: Store, tone: "text-orange-500" },
    { label: "Comparações disponíveis", value: comparacoes.length, icon: Tags, tone: "text-emerald-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl pb-6">
      <SectionTitle title="Encontre as melhores ofertas" description="Produtos e preços publicados por administradores e vendedores." action={<Button asChild variant="outline"><Link to="/cliente/comparador">Abrir comparador <ArrowRight className="size-4" /></Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        {indicadores.map(({ label, value, icon: Icon, tone }) => <Card key={label}><CardContent className="flex items-center gap-4"><span className="grid size-11 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800"><Icon className={`size-5 ${tone}`} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div></CardContent></Card>)}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2"><CircleDollarSign className="size-5 text-emerald-600" /><div><h2 className="font-bold">Comparações com preços cadastrados</h2><p className="text-sm text-slate-500">Exibimos apenas itens com preços em pelo menos dois mercados.</p></div></div>
        {comparacoes.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{comparacoes.map(({ produto, menorPreco, diferenca, mercados: quantidadeMercados }) => <Card key={produto.id}><CardContent><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-bold">{produto.name}</h3><p className="mt-1 text-sm text-slate-500">{produto.category}</p></div><ScanSearch className="size-5 shrink-0 text-brand-600" /></div><div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-sm"><div><p className="text-xs text-slate-500">Menor preço</p><p className="mt-1 font-bold text-emerald-600">{formatCurrency(menorPreco.price)}</p><p className="mt-1 truncate text-xs text-slate-500">{menorPreco.market}</p></div><div><p className="text-xs text-slate-500">Diferença</p><p className="mt-1 font-bold">{formatCurrency(diferenca)}</p><p className="mt-1 text-xs text-slate-500">{quantidadeMercados} mercados</p></div></div></CardContent></Card>)}</div> : <Card><EmptyState title="Ainda não há comparações disponíveis" description="As comparações aparecerão quando produtos receberem preços cadastrados em pelo menos dois mercados." action={false} /></Card>}
      </section>
    </div>
  );
}
