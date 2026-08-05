import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
  const createMarket = useCreateMarket();
  const updateMarket = useUpdateMarket();

  useEffect(() => {
    if (mode === "edit" && !id) {
      navigate("/admin/mercados");
    }
  }, [id, mode, navigate]);

  async function submit(input: MarketInput) {
    try {
      if (mode === "edit") {
        await updateMarket.mutateAsync({ id, input });
        toast.success("Mercado atualizado.");
        navigate(`/admin/mercados/${id}`);
      } else {
        const market = await createMarket.mutateAsync(input);
        toast.success("Mercado criado.");
        navigate(`/admin/mercados/${market.id}`);
      }
    } catch {
      toast.error("Erro ao salvar mercado.");
    }
  }

  if (mode === "edit") {
    if (marketQuery.isLoading) return <MarketSkeleton />;
    if (marketQuery.isError || !marketQuery.data) return <ApiError onRetry={() => void marketQuery.refetch()} />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle
        title={mode === "edit" ? "Editar mercado" : "Novo mercado"}
        description={mode === "edit" ? "Atualize as informações do mercado." : "Cadastre um mercado para acompanhar preços."}
        action={
          <Button variant="outline" onClick={() => navigate("/admin/mercados")}>Cancelar</Button>
        }
      />
      <Card>
        <CardContent className="p-5 sm:p-7">
          <MarketForm
            market={marketQuery.data}
            submitting={createMarket.isPending || updateMarket.isPending}
            onSubmit={submit}
          />
        </CardContent>
      </Card>
    </div>
  );
}

