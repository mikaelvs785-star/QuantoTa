import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { usePrecos } from "@/hooks/usePrecos";
import { useProdutos } from "@/hooks/useProdutos";
import { formatCurrency } from "@/lib/utils";
export function FeaturedProducts() {
  const produtosQuery = useProdutos({ size: 100 });
  const precosQuery = usePrecos();
  const produtos = produtosQuery.data?.content ?? [];
  const precos = precosQuery.data ?? [];
  const ofertas = produtos.flatMap((produto) => {
    const precosDoProduto = precos.filter((preco) => preco.productId === produto.id);
    if (!precosDoProduto.length) return [];
    const menorPreco = precosDoProduto.reduce((menor, preco) => preco.price < menor.price ? preco : menor);
    return [{ produto, menorPreco }];
  }).sort((a, b) => a.menorPreco.price - b.menorPreco.price).slice(0, 4);

  return <section><SectionTitle title="Ofertas cadastradas" description="Preços publicados pelos mercados." action={<Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/dashboard">Ver comparações</Link></Button>} />{produtosQuery.isLoading || precosQuery.isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /><div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /></div> : ofertas.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ofertas.map(({ produto, menorPreco }) => <Card key={produto.id} className="overflow-hidden"><CardContent className="p-5"><p className="text-sm text-slate-500">{produto.category}</p><p className="mt-2 min-h-10 font-semibold">{produto.name}</p><p className="mt-4 text-2xl font-black text-emerald-600">{formatCurrency(menorPreco.price)}</p><p className="mt-1 text-xs text-slate-500">Menor preço em {menorPreco.market}</p><Button asChild size="sm" className="mt-4"><Link to="/dashboard"><ShoppingCart className="size-3.5" /> Comparar</Link></Button></CardContent></Card>)}</div> : <Card><EmptyState title="Nenhuma oferta cadastrada" description="As ofertas serão exibidas quando mercados publicarem preços." action={false} /></Card>}</section>;
}
