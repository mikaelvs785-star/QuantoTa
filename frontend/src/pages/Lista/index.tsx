import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, Trash2, ListChecks } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecos } from "@/hooks/usePrecos";
import { listsService } from "@/services/lists";
import { offersForProduct, moneyTotal } from "@/lib/offers";
import { formatCurrency } from "@/lib/utils";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/components/ui/ApiError";
export default function ListaPage() {
  const { user } = useAuth();
  const client = useQueryClient();
  const [params] = useSearchParams();
  const [selectedListId, setSelectedListId] = useState<number>();
  const [productId, setProductId] = useState(params.get("produto") ?? "");
  const [quantity, setQuantity] = useState(1);
  const [newName, setNewName] = useState("");
  const queryKey = ["listas", user?.id];
  const query = useQuery({ queryKey, queryFn: listsService.getAll });
  const productsQuery = useProdutos();
  const pricesQuery = usePrecos();
  const lists = query.data ?? [];
  const selected = lists.find((l) => l.id === selectedListId) ?? lists[0];
  const products = (productsQuery.data?.content ?? []).filter(
    (p) => p.status === "ACTIVE",
  );
  const rows = (selected?.itens ?? []).map((item) => {
    const offer =
      item.produto.ativo === false
        ? undefined
        : offersForProduct(pricesQuery.data ?? [], String(item.produto.id))[0];
    return {
      ...item,
      quantity: item.quantidade,
      unitPrice: offer?.price ?? null,
      market: offer?.market,
    };
  });
  const missing = rows.filter((item) => item.unitPrice === null).length;
  const total = moneyTotal(rows);
  const mutation = useMutation({
    mutationFn: async (action: () => Promise<unknown>) => action(),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey });
    },
    onError: () => toast.error("Não foi possível salvar. Tente novamente."),
  });
  const busy = mutation.isPending;
  async function createList(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await mutation.mutateAsync(async () => {
        const list = await listsService.create(newName.trim());
        setSelectedListId(list.id);
        setNewName("");
      });
    } catch {
      /* onError handles feedback */
    }
  }
  function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !productId || !Number.isInteger(quantity) || quantity < 1)
      return;
    mutation.mutate(() => listsService.add(selected.id, productId, quantity));
  }
  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title="Sua compra, organizada."
        description="Crie listas, ajuste quantidades e consulte uma estimativa com os menores preços registrados."
        action={
          <Link
            to="/comparar"
            className="text-sm font-bold text-brand-600 dark:text-brand-200"
          >
            Comparar preços →
          </Link>
        }
      />
      <form
        onSubmit={createList}
        className="qt-panel mb-6 flex flex-wrap items-end gap-3"
      >
        <label className="min-w-0 flex-1">
          <span className="mb-2 block text-sm font-semibold">Nova lista</span>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={100}
            required
            placeholder="Ex.: Compras da semana"
          />
        </label>
        <Button type="submit" disabled={busy || !newName.trim()}>
          <Plus className="size-4" />
          Criar lista
        </Button>
      </form>
      {query.isPending || productsQuery.isPending || pricesQuery.isPending ? (
        <p role="status">Carregando sua lista...</p>
      ) : query.isError || productsQuery.isError || pricesQuery.isError ? (
        <ApiError
          onRetry={() => {
            void query.refetch();
            void productsQuery.refetch();
            void pricesQuery.refetch();
          }}
        />
      ) : !selected ? (
        <div className="qt-empty">
          <ListChecks className="mx-auto size-10 text-brand-600" />
          <h2 className="mt-4 text-xl font-semibold">
            Comece pela sua primeira lista.
          </h2>
          <p className="qt-muted mt-2">
            Dê um nome acima e adicione os produtos que precisa comprar.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-3 text-sm font-semibold">
              Lista
              <select
                aria-label="Selecionar lista"
                className="qt-select max-w-64"
                value={selected.id}
                onChange={(e) => setSelectedListId(Number(e.target.value))}
              >
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.nomeLista}
                  </option>
                ))}
              </select>
            </label>
            <p className="qt-muted">Salva na sua conta</p>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
            <section className="qt-panel">
              <form
                onSubmit={addItem}
                className="mb-6 grid items-end gap-3 sm:grid-cols-[1fr_90px_auto]"
              >
                <label>
                  <span className="mb-2 block text-sm font-semibold">
                    Produto
                  </span>
                  <select
                    className="qt-select"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                        {p.brand ? ` · ${p.brand}` : ""}
                        {p.unit ? ` · ${p.unit}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold">Qtd.</span>
                  <Input
                    type="number"
                    min="1"
                    max="999"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                  />
                </label>
                <Button type="submit" disabled={busy || !productId}>
                  Adicionar
                </Button>
              </form>
              {rows.length ? (
                <div className="divide-y">
                  {rows.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-5"
                    >
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold">{item.produto.nome}</h2>
                        <p className="qt-muted mt-1">
                          {[item.produto.marca, item.produto.unidadeMedida]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <p className="qt-muted mt-1">
                          {item.market
                            ? `${item.market} · ${formatCurrency(item.unitPrice!)} por unidade`
                            : item.produto.ativo === false
                              ? "Produto indisponível"
                              : "Sem preço registrado"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Diminuir quantidade de ${item.produto.nome}`}
                          disabled={busy || item.quantity <= 1}
                          onClick={() =>
                            mutation.mutate(() =>
                              listsService.update(
                                selected.id,
                                item.id,
                                item.quantity - 1,
                              ),
                            )
                          }
                        >
                          −
                        </Button>
                        <span className="w-7 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Aumentar quantidade de ${item.produto.nome}`}
                          disabled={busy || item.quantity >= 999}
                          onClick={() =>
                            mutation.mutate(() =>
                              listsService.update(
                                selected.id,
                                item.id,
                                item.quantity + 1,
                              ),
                            )
                          }
                        >
                          +
                        </Button>
                        <span className="ml-2 min-w-20 text-right text-sm font-bold">
                          {item.unitPrice !== null
                            ? formatCurrency(moneyTotal([item]))
                            : "—"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remover ${item.produto.nome}`}
                          disabled={busy}
                          onClick={() =>
                            mutation.mutate(() =>
                              listsService.remove(selected.id, item.id),
                            )
                          }
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="qt-muted py-8 text-center">
                  Sua lista ainda está vazia. Escolha um produto acima.
                </p>
              )}
            </section>
            <aside className="qt-panel">
              <p className="qt-eyebrow">RESUMO DA LISTA</p>
              <h2 className="mt-3 text-xl font-semibold">
                {selected.nomeLista}
              </h2>
              <div className="mt-6 space-y-3 text-sm">
                <p className="flex justify-between">
                  <span>Produtos</span>
                  <strong>{rows.length}</strong>
                </p>
                <p className="flex justify-between">
                  <span>Quantidade total</span>
                  <strong>
                    {rows.reduce((sum, row) => sum + row.quantity, 0)}
                  </strong>
                </p>
                <p className="flex justify-between">
                  <span>Mercados sugeridos</span>
                  <strong>
                    {
                      new Set(
                        rows.flatMap((row) => (row.market ? [row.market] : [])),
                      ).size
                    }
                  </strong>
                </p>
              </div>
              <div className="mt-6 border-t pt-6">
                <p className="qt-muted">
                  {missing ? "Subtotal dos itens com preço" : "Total estimado"}
                </p>
                <p className="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-200">
                  {rows.length ? formatCurrency(total) : "—"}
                </p>
                {missing > 0 && (
                  <p
                    role="status"
                    className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/15 dark:text-amber-200"
                  >
                    Estimativa incompleta: {missing} produto(s) sem preço
                    disponível.
                  </p>
                )}
                <p className="qt-muted mt-4">
                  Soma dos menores preços de cada item, que podem estar em
                  mercados diferentes. Não inclui deslocamento e não representa
                  uma compra realizada.
                </p>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
