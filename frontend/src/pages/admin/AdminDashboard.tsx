import { BarChart3, Package, Store, Tags, Users } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { ApiError } from "@/components/ui/ApiError";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { StatCard } from "@/components/dashboard/StatCard";
import { SkeletonCard } from "@/components/dashboard/SkeletonCard";
import type { DashboardMetric } from "@/types/dashboard";

const metricIcons = {
  products: Package,
  markets: Store,
  prices: Tags,
  users: Users,
};

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const dashboard = useDashboard();

  if (dashboard.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboard.isError) {
    return (
      <ApiError
        onRetry={() => void dashboard.refetch()}
        offline
      />
    );
  }

  const data = dashboard.data;

  if (!data) {
    return <ApiError onRetry={() => void dashboard.refetch()} />;
  }

  return (
    <div className="mx-auto max-w-7xl pb-4">
      <SectionTitle
        title="Painel administrativo"
        description="Gerencie produtos, mercados, preços e usuários do QuantoTá."
        action={
          <span className="hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-slate-500 sm:flex">
            <BarChart3 className="size-4 text-blue-600" />
            Dados atualizados
          </span>
        }
      />

      <DashboardGrid>
        {data.metrics.length ? (
          data.metrics.map((metric: DashboardMetric) => {
            const Icon =
              metricIcons[
                metric.key as keyof typeof metricIcons
              ] ?? BarChart3;

            return (
              <StatCard
                key={metric.key}
                metric={metric}
                icon={Icon}
              />
            );
          })
        ) : (
          <p>Nenhuma métrica disponível.</p>
        )}
      </DashboardGrid>
    </div>
  );
}