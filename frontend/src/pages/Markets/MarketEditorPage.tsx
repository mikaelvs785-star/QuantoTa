import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";
import { api } from "@/services/api";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MarketForm } from "@/components/markets/MarketForm";
import { MarketSkeleton } from "@/components/markets/MarketSkeleton";
import { useCreateMarket } from "@/hooks/useCreateMarket";
import { useMarket } from "@/hooks/useMarket";
import { useUpdateMarket } from "@/hooks/useUpdateMarket";
import type { MarketInput } from "@/types/market";

export function MarketEditorPage({ mode }: { mode: "create" | "edit" }) {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const marketQuery = useMarket(id);
  const permissions = usePermissions();
  const assignment = useQuery({
    queryKey: ["mercado", id, "vendedor"],
    queryFn: async () =>
      (
        await api.get<{ vendedorId: string | number }>(
          `/mercados/${id}/vendedor`,
        )
      ).data,
    enabled:
      mode === "edit" && permissions.data?.gerenciarTodosMercados === true,
  });
  const createMarket = useCreateMarket();
  const updateMarket = useUpdateMarket();

  async function submit(input: MarketInput) {
    try {
      if (mode === "edit") {
        await updateMarket.mutateAsync({ id, input });
        toast.success("Mercado atualizado.");
        navigate("/catalogo?aba=mercados");
      } else {
        await createMarket.mutateAsync(input);
        toast.success("Mercado criado.");
        navigate("/catalogo?aba=mercados");
      }
    } catch {
      toast.error("Erro ao salvar mercado.");
    }
  }

  if (mode === "edit") {
    if (
      marketQuery.isLoading ||
      (permissions.data?.gerenciarTodosMercados && assignment.isPending)
    )
      return <MarketSkeleton />;
    if (permissions.data?.gerenciarTodosMercados && assignment.isError)
      return <ApiError onRetry={() => void assignment.refetch()} />;
    if (marketQuery.isError || !marketQuery.data)
      return <ApiError onRetry={() => void marketQuery.refetch()} />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title={mode === "edit" ? "Editar mercado" : "Novo mercado"}
        description={
          mode === "edit"
            ? "Atualize as informações do mercado."
            : "Cadastre um mercado para acompanhar preços."
        }
        action={
          <Button
            variant="outline"
            onClick={() => navigate("/catalogo?aba=mercados")}
          >
            Cancelar
          </Button>
        }
      />
      <Card>
        <CardContent className="p-5 sm:p-7">
          <MarketForm
            market={marketQuery.data}
            vendedorId={String(assignment.data?.vendedorId ?? "")}
            submitting={createMarket.isPending || updateMarket.isPending}
            onSubmit={submit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
