import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ListChecks,
  ArrowLeftRight,
  Info,
  TriangleAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProdutos } from "@/hooks/useProdutos";
import { usePrecosAtuais } from "@/hooks/usePrecos";
import { listsService } from "@/services/lists";
import { formatCurrency } from "@/lib/utils";
import { displayDate } from "@/lib/offers";
import { ProductImage } from "@/components/storefront/Media";
import { MeasurePrice, ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/components/ui/ApiError";
export default function ListaPage() {
  const { user } = useAuth();
  const client = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number>();
  const [productId, setProductId] = useState(params.get("produto") ?? "");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const queryKey = ["listas", user?.id];
  const query = useQuery({ queryKey, queryFn: listsService.getAll });
  const products = useProdutos();
  const prices = usePrecosAtuais();
  const selected =
    query.data?.find((l) => l.id === selectedId) ?? query.data?.[0];
  const summary = useQuery({
    queryKey: ["resumo-lista", user?.id, selected?.id],
    queryFn: () => listsService.summary(selected!.id),
    enabled: !!selected,
  });
  const mode = params.get("visao") ?? "lista";
  const changeMode = (value: string) =>
    setParams((old) => {
      const next = new URLSearchParams(old);
      next.set("visao", value);
      return next;
    });
  const mutate = useMutation({
    mutationFn: async (action: () => Promise<unknown>) => action(),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey }),
        client.invalidateQueries({ queryKey: ["resumo-lista"] }),
      ]);
    },
    onError: () =>
      toast.error(
        "Não foi possível salvar. Confira a quantidade e tente novamente.",
      ),
  });
  const busy = mutate.isPending;
  const rows = (selected?.itens ?? []).map((i) => ({
    ...i,
    estimate: summary.data?.estimativas.find((e) => e.itemId === i.id),
  }));
  const active = (products.data?.content ?? []).filter(
    (p) => p.status === "ACTIVE",
  );
  const categories = new Set(
    active
      .filter((p) => rows.some((i) => String(i.produto.id) === p.id))
      .map((p) => p.category),
  );
  const suggestions = active
    .filter(
      (p) =>
        !rows.some((i) => String(i.produto.id) === p.id) &&
        categories.has(p.category),
    )
    .slice(0, 3);
  const data = summary.data;
  const cheapest = data?.mercados.find(
    (m) => m.mercadoId === data.mercadoMaisBaratoId,
  );
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="qt-heading">
          {mode === "mercados"
            ? "Onde comprar tudo?"
            : mode === "dividir"
              ? "Vale dividir a compra?"
              : "Sua próxima compra."}
        </h1>
        <p className="qt-muted mt-3">
          Organize sua lista e escolha como fazer a compra mais em conta.
        </p>
      </div>
      <form
        className="qt-panel mb-6 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim())
            mutate.mutate(async () => {
              const list = await listsService.create(name.trim());
              setSelectedId(list.id);
              setName("");
            });
        }}
      >
        <label className="min-w-0 flex-1">
          <span className="mb-2 block text-sm font-semibold">Nova lista</span>
          <Input
            value={name}
            maxLength={100}
            required
            placeholder="Ex.: Compras da semana"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <Button type="submit" disabled={busy || !name.trim()}>
          <Plus className="size-4" />
          Criar lista
        </Button>
      </form>
      {query.isPending ||
      products.isPending ||
      (selected && summary.isPending) ? (
        <p role="status">Carregando sua lista…</p>
      ) : query.isError || products.isError || summary.isError ? (
        <ApiError
          onRetry={() => {
            void query.refetch();
            void products.refetch();
            if (selected) void summary.refetch();
          }}
        />
      ) : !selected ? (
        <div className="qt-empty">
          <ListChecks className="mx-auto size-10 text-brand-600" />
          <h2 className="mt-4 text-xl font-bold">
            Comece pela sua primeira lista.
          </h2>
          <p className="qt-muted mt-3">
            Dê um nome acima e escolha os produtos que precisa comprar.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Selecionar lista</span>
              <select
                aria-label="Selecionar lista"
                className="qt-select max-w-sm"
                value={selected.id}
                onChange={(e) => setSelectedId(Number(e.target.value))}
              >
                {query.data?.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nomeLista}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                ["lista", "Minha lista"],
                ["mercados", "Um mercado"],
                ["dividir", "Dividir compra"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={`qt-chip ${mode === value ? "qt-chip-active" : ""}`}
                  aria-pressed={mode === value}
                  onClick={() => changeMode(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {mode === "lista" && (
            <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
              <section className="qt-panel">
                <form
                  className="mb-6 grid items-end gap-3 sm:grid-cols-[1fr_80px_auto]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (
                      productId &&
                      Number.isInteger(quantity) &&
                      quantity > 0 &&
                      quantity <= 999
                    )
                      mutate.mutate(() =>
                        listsService.add(selected.id, productId, quantity),
                      );
                  }}
                >
                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Produto
                    </span>
                    <select
                      aria-label="Produto"
                      className="qt-select"
                      required
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                    >
                      <option value="">Selecione um produto</option>
                      {active.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {p.brand} · {p.unit}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Qtd.
                    </span>
                    <Input
                      type="number"
                      min={1}
                      max={999}
                      step={1}
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </label>
                  <Button type="submit" disabled={busy || !productId}>
                    Adicionar
                  </Button>
                </form>
                {rows.length ? (
                  rows.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-wrap items-center gap-4 border-t py-5"
                    >
                      <ProductImage
                        id={item.estimate?.imagemId}
                        alt={item.produto.nome}
                        className="size-20 shrink-0 rounded-xl"
                      />
                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold">{item.produto.nome}</h2>
                        <p className="qt-muted">
                          {item.produto.marca} · {item.produto.unidadeMedida}
                        </p>
                        <p className="qt-muted">
                          {item.estimate?.mercado ?? "Sem preço registrado"}
                        </p>
                        {item.estimate?.precoUnitario != null && (
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.estimate.precoUnitario)} por
                            embalagem
                          </p>
                        )}
                        <MeasurePrice
                          price={item.estimate?.precoPorMedida}
                          unit={item.estimate?.unidadeBase}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Diminuir quantidade de ${item.produto.nome}`}
                            disabled={busy || item.quantidade <= 1}
                            onClick={() =>
                              mutate.mutate(() =>
                                listsService.update(
                                  selected.id,
                                  item.id,
                                  item.quantidade - 1,
                                ),
                              )
                            }
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="w-6 text-center">
                            {item.quantidade}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Aumentar quantidade de ${item.produto.nome}`}
                            disabled={busy || item.quantidade >= 999}
                            onClick={() =>
                              mutate.mutate(() =>
                                listsService.update(
                                  selected.id,
                                  item.id,
                                  item.quantidade + 1,
                                ),
                              )
                            }
                          >
                            <Plus className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Remover ${item.produto.nome}`}
                            disabled={busy}
                            onClick={() =>
                              mutate.mutate(() =>
                                listsService.remove(selected.id, item.id),
                              )
                            }
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                        <p className="mt-2 text-right text-lg font-bold">
                          {item.estimate?.subtotal != null
                            ? formatCurrency(item.estimate.subtotal)
                            : "Sem preço"}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="qt-empty">
                    <p>Sua lista está vazia. Escolha um produto acima.</p>
                  </div>
                )}
              </section>
              <aside className="qt-panel">
                <p className="qt-eyebrow">
                  {data?.itensSemPreco
                    ? "SUBTOTAL CONHECIDO"
                    : "MENORES PREÇOS COMBINADOS"}
                </p>
                <p className="mt-3 text-3xl font-bold text-brand-700 dark:text-brand-100">
                  {rows.length ? formatCurrency(data?.valorEstimado ?? 0) : "—"}
                </p>
                <p className="qt-muted mt-3">
                  Preços de {data?.quantidadeMercados ?? 0} mercado(s).
                </p>
                {!!data?.itensSemPreco && (
                  <p
                    role="status"
                    className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-100"
                  >
                    Estimativa incompleta: {data.itensSemPreco} produto(s) sem
                    preço disponível.
                  </p>
                )}
                <p className="qt-muted mt-4">
                  Deslocamento e entrega não incluídos. Valores registrados,
                  sujeitos a alteração no mercado.
                </p>
                <button
                  className="qt-action mt-5 w-full"
                  disabled={!rows.length}
                  onClick={() => changeMode("mercados")}
                >
                  <ArrowLeftRight className="size-4" />
                  Comparar por mercado
                </button>
                <Link className="qt-secondary mt-3 w-full" to="/explorar">
                  Continuar explorando
                </Link>
              </aside>
            </div>
          )}
          {mode === "mercados" && (
            <section className="space-y-4">
              {!rows.length ? (
                <div className="qt-empty">
                  Adicione produtos para comparar sua lista.
                </div>
              ) : (
                <>
                  {!cheapest && (
                    <p role="status" className="qt-panel">
                      Nenhum mercado tem preço registrado para todos os itens
                      desta lista.
                    </p>
                  )}
                  {data?.mercados.map((m) => (
                    <article
                      key={m.mercadoId}
                      className={`qt-panel ${m.mercadoId === data.mercadoMaisBaratoId ? "!border-brand-500" : !m.completa ? "!border-amber-300" : ""}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {m.imagemId && (
                            <ProductImage
                              id={m.imagemId}
                              alt={m.mercado}
                              className="size-20 rounded-xl"
                            />
                          )}
                          <div>
                            <h2 className="text-xl font-bold">{m.mercado}</h2>
                            <p className="qt-muted">
                              {m.produtosComPreco} de {rows.length} produtos com
                              preço
                            </p>
                            <span
                              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${m.completa ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-900"}`}
                            >
                              {m.mercadoId === data.mercadoMaisBaratoId
                                ? "Mais barato com a lista completa"
                                : m.completa
                                  ? "Lista completa"
                                  : "Lista incompleta"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="qt-muted">
                            {m.completa
                              ? "Total da lista"
                              : "Subtotal conhecido"}
                          </p>
                          <p className="text-3xl font-bold">
                            {formatCurrency(m.subtotal)}
                          </p>
                        </div>
                      </div>
                      {!m.completa && (
                        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
                          <p className="flex items-center gap-2 font-semibold">
                            <TriangleAlert className="size-4" />
                            Sem preço para: {m.produtosSemPreco.join(", ")}
                          </p>
                          <p className="mt-2">
                            Este subtotal não equivale ao total da lista
                            completa.
                          </p>
                        </div>
                      )}
                      <details className="mt-4">
                        <summary className="cursor-pointer py-2 font-semibold">
                          Ver itens por mercado
                        </summary>
                        <div className="mt-2 divide-y">
                          {m.itens.map((i) => (
                            <div
                              key={i.itemId}
                              className="flex flex-wrap justify-between gap-2 py-3 text-sm"
                            >
                              <span>
                                {i.produto} × {i.quantidade}
                                {i.dataColeta && (
                                  <small className="block text-slate-500">
                                    Coletado em {displayDate(i.dataColeta)}
                                  </small>
                                )}
                              </span>
                              <span>
                                {i.precoUnitario == null
                                  ? "Sem preço"
                                  : `${i.quantidade} × ${formatCurrency(i.precoUnitario)} = ${formatCurrency(i.subtotal!)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </article>
                  ))}
                </>
              )}
            </section>
          )}
          {mode === "dividir" && (
            <section className="mx-auto max-w-3xl space-y-4">
              {!rows.length ? (
                <div className="qt-empty">
                  Adicione produtos à lista para comparar.
                </div>
              ) : (
                <>
                  {rows.map((i) => (
                    <article className="qt-offer" key={i.id}>
                      <div className="flex items-center gap-4">
                        <ProductImage
                          id={i.estimate?.imagemId}
                          alt={i.produto.nome}
                          className="size-20 rounded-xl"
                        />
                        <div>
                          <h2 className="font-bold">{i.produto.nome}</h2>
                          <p className="qt-muted">
                            {i.produto.marca} · {i.produto.unidadeMedida} ·{" "}
                            {i.quantidade} embalagem(ns)
                          </p>
                          <p className="text-sm font-semibold">
                            {i.estimate?.mercado ?? "Sem preço registrado"}
                          </p>
                          {i.estimate?.dataColeta && (
                            <p className="qt-muted text-xs">
                              Coletado em {displayDate(i.estimate.dataColeta)}
                            </p>
                          )}
                        </div>
                      </div>
                      <strong className="text-xl">
                        {i.estimate?.subtotal != null
                          ? formatCurrency(i.estimate.subtotal)
                          : "Sem preço"}
                      </strong>
                    </article>
                  ))}
                  <div className="qt-success">
                    <p className="font-semibold">
                      {data?.estimativaCompleta
                        ? "Total combinado"
                        : "Subtotal conhecido — lista incompleta"}
                    </p>
                    <p className="mt-2 text-4xl font-bold">
                      {formatCurrency(data?.valorEstimado ?? 0)}
                    </p>
                    <p className="mt-2">
                      {data?.quantidadeMercados} mercado(s)
                    </p>
                  </div>
                  {cheapest && data?.diferencaCompraDividida != null ? (
                    <div className="qt-panel">
                      <p>
                        Tudo no {cheapest.mercado}:{" "}
                        <strong>{formatCurrency(cheapest.subtotal)}</strong>
                      </p>
                      <p className="mt-3">
                        Diferença nos produtos:{" "}
                        <strong>
                          {formatCurrency(data.diferencaCompraDividida)}
                        </strong>
                      </p>
                    </div>
                  ) : (
                    <p className="qt-panel">
                      Não há uma lista completa em um único mercado para
                      calcular a diferença.
                    </p>
                  )}
                  <p className="qt-muted flex gap-2">
                    <Info className="mt-1 size-4 shrink-0" />
                    Deslocamento e entrega não estão incluídos. Confira os
                    preços no mercado.
                  </p>
                  <button
                    className="qt-action w-full"
                    onClick={() => changeMode("mercados")}
                  >
                    Comparar em um só mercado
                  </button>
                </>
              )}
            </section>
          )}
          {mode === "lista" && suggestions.length > 0 && !prices.isError && (
            <section className="mt-9">
              <h2 className="qt-section-heading">Quer completar sua lista?</h2>
              <p className="qt-muted mb-5 mt-2">
                Mais opções nas categorias da sua compra. Você escolhe o que
                adicionar.
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {suggestions.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    offer={
                      (prices.data ?? [])
                        .filter((o) => o.productId === p.id)
                        .sort((a, b) => a.price - b.price)[0]
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
