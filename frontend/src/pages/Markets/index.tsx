import { ChevronLeft, ChevronRight, PackagePlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DeleteMarketDialog } from "@/components/markets/DeleteMarketDialog";
import { MarketCard } from "@/components/markets/MarketCard";
import { MarketEmptyState } from "@/components/markets/MarketEmptyState";
import { MarketFilters } from "@/components/markets/MarketFilters";
import { MarketSkeleton } from "@/components/markets/MarketSkeleton";
import { MarketTable } from "@/components/markets/MarketTable";
import { useDeleteMarket } from "@/hooks/useDeleteMarket";
import { useMarkets } from "@/hooks/useMarkets";
import type { Market, MarketStatus } from "@/types/market";

const PAGE_SIZE = 10;

export default function Markets() {
  const navigate = useNavigate();
  const marketsQuery = useMarkets();
  const removeMarket = useDeleteMarket();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MarketStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Market | null>(null);

  const filtered = useMemo(() => {
    const markets = marketsQuery.data?.content ?? [];
    const result = markets.filter((market) =>
      (!search || market.name.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"))) &&
      (status === "ALL" || market.status === status),
    );

    return result.sort((first, second) =>
      new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
    );
  }, [marketsQuery.data, search, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const displayed = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(query: string) {
    setSearch(query);
    setPage(1);
  }

  function handleReset() {
    setSearch("");
    setStatus("ALL");
    setPage(1);
  }

  async function confirmDelete() {
    if (!selected) return;
    try {
      await removeMarket.mutateAsync(selected.id);
      toast.success("Mercado removido.");
      setSelected(null);
    } catch {
      toast.error("Erro ao excluir mercado.");
    }
  }

  if (marketsQuery.isLoading) return <MarketSkeleton />;
  if (marketsQuery.isError) return <ApiError onRetry={() => void marketsQuery.refetch()} offline />;

  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle
        title="Mercados"
        description="Gerencie os mercados que você acompanha."
        action={
          <Button asChild>
            <Link to="/mercados/novo">
              <PackagePlus className="size-4" /> Novo mercado
            </Link>
          </Button>
        }
      />

      <MarketFilters onSearch={handleSearch} onReset={handleReset} />

      <div className="mt-5">
        {filtered.length ? (
          <>
            <MarketTable
              markets={displayed}
              onEdit={(market) => navigate(`/mercados/${market.id}/editar`)}
              onDelete={setSelected}
            />
            <div className="space-y-3 md:hidden">
              {displayed.map((market) => (
                <MarketCard key={market.id} market={market} onDelete={setSelected} />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm">
              <p className="text-slate-500">{filtered.length} mercado{filtered.length === 1 ? "" : "s"}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" aria-label="Página anterior" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
                  <ChevronLeft className="size-4" /> Anterior
                </Button>
                <span className="text-xs text-slate-500">Página {page} de {pageCount}</span>
                <Button variant="outline" size="sm" aria-label="Próxima página" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>
                  Próxima <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <MarketEmptyState />
        )}
      </div>

      <DeleteMarketDialog market={selected} loading={removeMarket.isPending} onConfirm={() => void confirmDelete()} onClose={() => setSelected(null)} />
    </div>
  );
}
