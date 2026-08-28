import {
  BarChart3,
  Package,
  Plus,
  Store,
  Tags,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useDashboard } from "@/hooks/useDashboard";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
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
    <div className="mx-auto max-w-7xl space-y-6 pb-6">
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

      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Ações rápidas
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <Package className="size-6 text-blue-600" />

                <div>
                  <h3 className="font-semibold">
                    Novo produto
                  </h3>

                  <p className="text-sm text-slate-500">
                    Cadastre um produto para comparação.
                  </p>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to="/admin/produtos/novo">
                  <Plus className="size-4" />
                  Novo produto
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <Store className="size-6 text-blue-600" />

                <div>
                  <h3 className="font-semibold">
                    Novo mercado
                  </h3>

                  <p className="text-sm text-slate-500">
                    Cadastre um novo mercado.
                  </p>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to="/admin/mercados/novo">
                  <Plus className="size-4" />
                  Novo mercado
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <Users className="size-6 text-blue-600" />

                <div>
                  <h3 className="font-semibold">
                    Novo usuário
                  </h3>

                  <p className="text-sm text-slate-500">
                    Gerencie clientes e vendedores.
                  </p>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to="/admin/usuarios/novo">
                  <Plus className="size-4" />
                  Novo usuário
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <Tags className="size-6 text-blue-600" />

                <div>
                  <h3 className="font-semibold">
                    Gerenciar preços
                  </h3>

                  <p className="text-sm text-slate-500">
                    Consulte os preços cadastrados.
                  </p>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to="/admin/precos">
                  <Tags className="size-4" />
                  Ver preços
                </Link>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}