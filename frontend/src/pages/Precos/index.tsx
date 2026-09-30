import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/services/api";
import { marketService } from "@/services/marketService";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecos } from "@/hooks/usePrecos";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatCurrency } from "@/lib/utils";
import { displayDate, currentOffers } from "@/lib/offers";
import type { PriceRecord } from "@/types/dashboard";
function today() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export default function PrecosPage() {
  const prices = usePrecos();
  const products = useProdutos();
  const markets = useQuery({
    queryKey: ["mercados", "precos"],
    queryFn: () => marketService.listarMercados(),
  });
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string>();
  const [productId, setProductId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(today);
  const [selected, setSelected] = useState<PriceRecord>();
  const currentIds = new Set(currentOffers(prices.data ?? []).map((p) => p.id));
  const mutation = useMutation({
    mutationFn: async (action: () => Promise<unknown>) => action(),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["precos"] }),
        client.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
      toast.success("Preço atualizado.");
    },
    onError: () =>
      toast.error("Não foi possível salvar o preço. Confira os campos."),
  });
  function edit(price: PriceRecord) {
    setEditing(price.id);
    setProductId(price.productId);
    setMarketId(price.marketId);
    setValue(String(price.price));
    setDate(price.date);
    setOpen(true);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(value.replace(",", "."));
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !/^\d+([.,]\d{1,2})?$/.test(value) ||
      date > today()
    ) {
      toast.error("Informe um valor positivo e uma data não futura.");
      return;
    }
    const payload = {
      produtoId: Number(productId),
      mercadoId: Number(marketId),
      valor: amount,
      dataColeta: date,
    };
    try {
      await mutation.mutateAsync(() =>
        editing
          ? api.put(`/precos/${editing}`, payload)
          : api.post("/precos", payload),
      );
      setOpen(false);
      setEditing(undefined);
      setValue("");
    } catch {
      /* feedback in onError */
    }
  }
  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title="Preços que fazem sentido."
        description="Registre valor e data para cada produto e mercado. O registro mais recente de cada par aparece na comparação."
        action={
          <Button
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
              setProductId("");
              setMarketId("");
              setValue("");
              setDate(today());
            }}
          >
            <Plus className="size-4" />
            Registrar preço
          </Button>
        }
      />
      {open && (
        <form onSubmit={save} className="qt-panel mb-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editing ? "Editar registro" : "Novo registro"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fechar formulário"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label>
              <span className="mb-2 block text-sm font-semibold">Produto</span>
              <select
                className="qt-select"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">Selecione</option>
                {products.data?.content
                  .filter((p) => p.status === "ACTIVE")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.brand} {p.unit}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold">Mercado</span>
              <select
                className="qt-select"
                required
                value={marketId}
                onChange={(e) => setMarketId(e.target.value)}
              >
                <option value="">Selecione</option>
                {markets.data?.content
                  .filter((m) => m.status === "ACTIVE")
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold">
                Valor (R$)
              </span>
              <Input
                required
                inputMode="decimal"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold">
                Data de coleta
              </span>
              <Input
                type="date"
                required
                max={today()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          </div>
          <Button
            type="submit"
            className="mt-5"
            disabled={
              mutation.isPending || products.isPending || markets.isPending
            }
          >
            {mutation.isPending ? "Salvando..." : "Salvar registro"}
          </Button>
        </form>
      )}
      {prices.isPending || products.isPending || markets.isPending ? (
        <p role="status">Carregando registros...</p>
      ) : prices.isError || products.isError || markets.isError ? (
        <ApiError
          onRetry={() => {
            void prices.refetch();
            void products.refetch();
            void markets.refetch();
          }}
        />
      ) : prices.data?.length ? (
        <section className="qt-panel">
          <div className="divide-y">
            {[...prices.data]
              .sort(
                (a, b) =>
                  b.date.localeCompare(a.date) || Number(b.id) - Number(a.id),
              )
              .map((price) => (
                <article
                  key={price.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                >
                  <div>
                    <h2 className="font-semibold">{price.product}</h2>
                    <p className="qt-muted">
                      {price.market} · {displayDate(price.date)}
                    </p>
                    <span
                      className={`text-xs font-semibold ${currentIds.has(price.id) ? "text-brand-600 dark:text-brand-200" : "text-slate-400"}`}
                    >
                      {currentIds.has(price.id)
                        ? "Registro atual"
                        : "Histórico"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="mr-4 text-xl font-bold">
                      {formatCurrency(price.price)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar preço de ${price.product} em ${price.market}`}
                      onClick={() => edit(price)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Excluir preço de ${price.product} em ${price.market}`}
                      onClick={() => setSelected(price)}
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ) : (
        <div className="qt-empty">
          <h2 className="font-semibold">Ainda não há preços registrados.</h2>
          <p className="qt-muted mt-2">
            Cadastre produto e mercado antes de registrar o primeiro preço.
          </p>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(selected)}
        title="Excluir registro de preço?"
        message="Ao excluir um registro atual, o preço anterior pode voltar a aparecer no comparador."
        loading={mutation.isPending}
        onClose={() => setSelected(undefined)}
        onConfirm={() => {
          if (selected)
            mutation.mutate(() => api.delete(`/precos/${selected.id}`), {
              onSuccess: () => setSelected(undefined),
            });
        }}
      />
    </div>
  );
}
