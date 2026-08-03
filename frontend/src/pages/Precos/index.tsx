import { Card, CardContent } from "@/components/ui/Card";
import { ApiError } from "@/components/ui/ApiError";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PriceTable } from "@/components/dashboard/PriceTable";
import { usePrecos } from "@/hooks/usePrecos";

export default function PrecosPage() {
  const precosQuery = usePrecos();

  if (precosQuery.isLoading) {
    return <div className="mx-auto max-w-7xl"><SectionTitle title="Preços" description="Acompanhe o histórico recente de preços." /><div className="mt-5 h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" /></div>;
  }

  if (precosQuery.isError) {
    return <ApiError onRetry={() => void precosQuery.refetch()} offline />;
  }

  const precos = precosQuery.data ?? [];

  return (
    <div className="mx-auto max-w-7xl">
      <SectionTitle title="Preços" description="Reveja os preços cadastrados e acompanhe as últimas atualizações." />
      <Card className="mt-5">
        <CardContent className="p-4 sm:p-5">
          <PriceTable prices={precos} />
        </CardContent>
      </Card>
    </div>
  );
}
