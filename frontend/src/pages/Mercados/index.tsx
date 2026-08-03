import { ApiError } from "@/components/ui/ApiError";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MarketCard } from "@/components/dashboard/MarketCard";
import { useMercados } from "@/hooks/useMercados";

export default function MercadosPage() {
  const mercadosQuery = useMercados();

  if (mercadosQuery.isLoading) {
    return <div className="mx-auto max-w-7xl"><SectionTitle title="Mercados" description="Acompanhe os mercados em destaque." /><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><div className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" /><div className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" /><div className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" /></div></div>;
  }

  if (mercadosQuery.isError) {
    return <ApiError onRetry={() => void mercadosQuery.refetch()} offline />;
  }

  const mercados = mercadosQuery.data ?? [];

  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle title="Mercados" description="Compare os melhores preços por estabelecimento." />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mercados.length ? mercados.map((market) => <MarketCard key={market.id} market={market} />) : <div className="col-span-full"><EmptyState title="Nenhum mercado encontrado" description="Cadastre mercados para acompanhar as melhores ofertas." action={false} /></div>}
      </div>
    </div>
  );
}
