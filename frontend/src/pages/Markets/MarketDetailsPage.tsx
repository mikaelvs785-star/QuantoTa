import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/components/ui/ApiError";
import { MarketDetails } from "@/components/markets/MarketDetails";
import { MarketSkeleton } from "@/components/markets/MarketSkeleton";
import { useMarket } from "@/hooks/useMarket";

export function MarketDetailsPage() {
  const { id = "" } = useParams();
  const marketQuery = useMarket(id);

  if (marketQuery.isLoading) return <MarketSkeleton />;
  if (marketQuery.isError || !marketQuery.data) return <ApiError onRetry={() => void marketQuery.refetch()} />;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <Link to="/admin/mercados" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
          <ArrowLeft className="size-4" /> Voltar para mercados
        </Link>
      </div>
      <MarketDetails market={marketQuery.data} />
    </div>
  );
}

