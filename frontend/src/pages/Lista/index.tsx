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
    .slice(0, 4);
  const data = summary.data;
  const cheapest = data?.mercados.find(
    (m) => m.mercadoId === data.mercadoMaisBaratoId,
  );

  return (
    <div className="w-full">
      <section className="mb-5 rounded-[30px] bg-[#f2eadc] px-5 py-6 dark:bg-slate-900 sm:px-7 lg:px-9 lg:py-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[.18em] text-orange-500">
              PLANEJE A COMPRA
            </p>
            <h1 className="mt-2 text-3xl font-black leading-none tracking-[-.04em] text-brand-700 dark:text-brand-100 sm:text-4xl lg:text-5xl">
              {mode === "mercados"
                ? "Onde comprar tudo?"
                : mode === "dividir"
                  ? "Vale dividir a compra?"
                  : "Sua próxima compra."}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Organize sua lista e escolha como fazer a compra mais em conta.
            </p>
          </div>

          <form
            className="flex w-full max-w-2xl flex-col gap-3 rounded-[24px] bg-white p-3 shadow-[0_14px_36px_-28px_rgba(15,83,69,.4)] dark:bg-slate-950 sm:flex-row sm:items-end"
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
              <span className="mb-2 block text-xs font-extrabold text-slate-500 dark:text-slate-400">
                Nova lista
              </span>
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
        </div>
      </section>

      {query.isPending ||
      products.isPending ||
      (selected && summary.isPending) ? (
        <p role="status" className="py-10 text-center text-sm text-slate-500">
          Carregando sua lista…
        </p>
      ) : query.isError || products.isError || summary.isError ? (
        <ApiError
          onRetry={() => {
            void query.refetch();
            void products.refetch();
            if (selected) void summary.refetch();
          }}
        />
      ) : !selected ? (
        <div className="rounded-[30px] bg-white px-6 py-14 text-center shadow-[0_14px_36px_-28px_rgba(15,83,69,.4)] dark:bg-slate-900">
          <ListChecks className="mx-auto size-10 text-brand-600" />
          <h2 className="mt-4 text-xl font-black text-brand-700 dark:text-brand-100">
            Comece pela sua primeira lista.
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Dê um nome acima e escolha os produtos que precisa comprar.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 rounded-[24px] bg-white p-3 shadow-[0_10px_30px_-26px_rgba(15,83,69,.35)] dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Selecionar lista</span>
              <select
                aria-label="Selecionar lista"
                className="min-h-11 w-full max-w-sm rounded-xl bg-[#f8f6f0] px-3 text-sm font-bold outline-none dark:bg-slate-800"
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
            <div className="flex gap-2 overflow-x-auto">
              {[
                ["lista", "Minha lista"],
                ["mercados", "Um mercado"],
                ["dividir", "Dividir compra"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                    mode === value
                      ? "bg-brand-700 text-white"
                      : "bg-[#f8f6f0] text-brand-700 hover:bg-brand-50 dark:bg-slate-800 dark:text-brand-100"
                  }`}
                  aria-pressed={mode === value}
                  onClick={() => changeMode(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {mode === "lista" && (
            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
              <section className="rounded-[30px] bg-white p-4 shadow-[0_14px_36px_-28px_rgba(15,83,69,.4)] dark:bg-slate-900 sm:p-5">
                <form
                  className="mb-4 grid items-end gap-3 rounded-[22px] bg-[#f8f6f0] p-4 dark:bg-slate-800 sm:grid-cols-[1fr_90px_auto]"
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
                    <span className="mb-2 block text-xs font-extrabold text-slate-500 dark:text-slate-400">
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
                    <span className="mb-2 block text-xs font-extrabold text-slate-500 dark:text-slate-400">
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
                  <div className="divide-y divide-stone-200/70 dark:divide-slate-800">
                    {rows.map((item) => (
                      <article
                        key={item.id}
                        className="flex flex-wrap items-center gap-4 py-5 first:pt-2 last:pb-2"
                      >
                        <ProductImage
                          id={item.estimate?.imagemId}
                          alt={item.produto.nome}
                          className="size-20 shrink-0 rounded-[18px] bg-[#f2eadc]"
                        />
                        <div className="min-w-0 flex-1">
                          <h2 className="font-extrabold text-brand-700 dark:text-brand-100">
                            {item.produto.nome}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.produto.marca} · {item.produto.unidadeMedida}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.estimate?.mercado ?? "Sem preço registrado"}
                          </p>
                          {item.estimate?.precoUnitario != null && (
                            <p className="mt-1 text-sm font-semibold">
                              {formatCurrency(item.estimate.precoUnitario)} por
                              embalagem
                            </p>
                          )}
                          <MeasurePrice
                            price={item.estimate?.precoPorMedida}
                            unit={item.estimate?.unidadeBase}
                          />
                        </div>
                        <div className="ml-auto">
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
                            <span className="w-6 text-center font-bold">
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
                          <p className="mt-2 text-right text-lg font-black text-brand-700 dark:text-brand-100">
                            {item.estimate?.subtotal != null
                              ? formatCurrency(item.estimate.subtotal)
                              : "Sem preço"}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[22px] bg-[#f8f6f0] px-5 py-10 text-center text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Sua lista está vazia. Escolha um produto acima.
                  </div>
                )}
              </section>

              <aside className="sticky top-20 rounded-[30px] bg-brand-700 p-6 text-white shadow-[0_14px_36px_-28px_rgba(15,83,69,.5)]">
                <p className="text-[11px] font-black uppercase tracking-[.18em] text-brand-100/75">
                  {data?.itensSemPreco
                    ? "SUBTOTAL CONHECIDO"
                    : "MENORES PREÇOS COMBINADOS"}
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight">
                  {rows.length ? formatCurrency(data?.valorEstimado ?? 0) : "—"}
                </p>
                <p className="mt-3 text-sm text-brand-100/80">
                  Preços de {data?.quantidadeMercados ?? 0} mercado(s).
                </p>
                {!!data?.itensSemPreco && (
                  <p
                    role="status"
                    className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900"
                  >
                    Estimativa incompleta: {data.itensSemPreco} produto(s) sem
                    preço disponível.
                  </p>
                )}
                <p className="mt-4 text-xs leading-5 text-brand-100/70">
                  Deslocamento e entrega não incluídos. Valores registrados,
                  sujeitos a alteração no mercado.
                </p>
                <button
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ff982e] px-4 text-sm font-extrabold text-white disabled:opacity-50"
                  disabled={!rows.length}
                  onClick={() => changeMode("mercados")}
                >
                  <ArrowLeftRight className="size-4" />
                  Comparar por mercado
                </button>
                <Link
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white/10 px-4 text-sm font-extrabold text-white transition hover:bg-white/15"
                  to="/explorar"
                >
                  Continuar explorando
                </Link>
              </aside>
            </div>
          )}

          {mode === "mercados" && (
            <section className="space-y-3">
              {!rows.length ? (
                <div className="rounded-[30px] bg-[#f2eadc] px-6 py-12 text-center text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Adicione produtos para comparar sua lista.
                </div>
              ) : (
                <>
                  {!cheapest && (
                    <p
                      role="status"
                      className="rounded-[22px] bg-amber-50 p-4 text-sm font-semibold text-amber-900 dark:bg-amber-900/20 dark:text-amber-100"
                    >
                      Nenhum mercado tem preço registrado para todos os itens
                      desta lista.
                    </p>
                  )}
                  {data?.mercados.map((m) => (
                    <article
                      key={m.mercadoId}
                      className={`rounded-[28px] p-5 shadow-[0_12px_32px_-28px_rgba(15,83,69,.35)] sm:p-6 ${
                        m.mercadoId === data.mercadoMaisBaratoId
                          ? "bg-[#e6f2e8] ring-2 ring-brand-400 dark:bg-brand-700/20"
                          : !m.completa
                            ? "bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-900/15"
                            : "bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {m.imagemId && (
                            <ProductImage
                              id={m.imagemId}
                              alt={m.mercado}
                              className="size-20 rounded-[18px] bg-white"
                            />
                          )}
                          <div>
                            <h2 className="text-xl font-black text-brand-700 dark:text-brand-100">
                              {m.mercado}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {m.produtosComPreco} de {rows.length} produtos com
                              preço
                            </p>
                            <span
                              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                m.completa
                                  ? "bg-brand-700 text-white"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {m.mercadoId === data.mercadoMaisBaratoId
                                ? "Mais barato com a lista completa"
                                : m.completa
                                  ? "Lista completa"
                                  : "Lista incompleta"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {m.completa
                              ? "Total da lista"
                              : "Subtotal conhecido"}
                          </p>
                          <p className="mt-1 text-3xl font-black tracking-tight text-brand-700 dark:text-brand-100">
                            {formatCurrency(m.subtotal)}
                          </p>
                        </div>
                      </div>

                      {!m.completa && (
                        <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-amber-900 dark:bg-slate-900/50 dark:text-amber-100">
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

                      <details className="mt-4 rounded-2xl bg-white/60 px-4 py-2 dark:bg-slate-950/30">
                        <summary className="cursor-pointer py-2 font-extrabold text-brand-700 dark:text-brand-100">
                          Ver itens por mercado
                        </summary>
                        <div className="mt-1 divide-y divide-stone-200/70 dark:divide-slate-800">
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
            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              {!rows.length ? (
                <div className="rounded-[30px] bg-[#f2eadc] px-6 py-12 text-center text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300 xl:col-span-2">
                  Adicione produtos à lista para comparar.
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {rows.map((i) => (
                      <article
                        className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-white p-4 shadow-[0_10px_30px_-26px_rgba(15,83,69,.35)] dark:bg-slate-900"
                        key={i.id}
                      >
                        <div className="flex items-center gap-4">
                          <ProductImage
                            id={i.estimate?.imagemId}
                            alt={i.produto.nome}
                            className="size-20 rounded-[18px] bg-[#f2eadc]"
                          />
                          <div>
                            <h2 className="font-extrabold text-brand-700 dark:text-brand-100">
                              {i.produto.nome}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {i.produto.marca} · {i.produto.unidadeMedida} ·{" "}
                              {i.quantidade} embalagem(ns)
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {i.estimate?.mercado ?? "Sem preço registrado"}
                            </p>
                            {i.estimate?.dataColeta && (
                              <p className="mt-1 text-xs text-slate-400">
                                Coletado em {displayDate(i.estimate.dataColeta)}
                              </p>
                            )}
                          </div>
                        </div>
                        <strong className="text-xl font-black text-brand-700 dark:text-brand-100">
                          {i.estimate?.subtotal != null
                            ? formatCurrency(i.estimate.subtotal)
                            : "Sem preço"}
                        </strong>
                      </article>
                    ))}
                  </div>

                  <aside className="space-y-3">
                    <div className="rounded-[30px] bg-brand-700 p-6 text-white">
                      <p className="text-xs font-black uppercase tracking-[.16em] text-brand-100/75">
                        {data?.estimativaCompleta
                          ? "Total combinado"
                          : "Subtotal conhecido — lista incompleta"}
                      </p>
                      <p className="mt-3 text-4xl font-black tracking-tight">
                        {formatCurrency(data?.valorEstimado ?? 0)}
                      </p>
                      <p className="mt-2 text-sm text-brand-100/80">
                        {data?.quantidadeMercados} mercado(s)
                      </p>
                    </div>

                    {cheapest && data?.diferencaCompraDividida != null ? (
                      <div className="rounded-[24px] bg-[#e6f2e8] p-5 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100">
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
                      <p className="rounded-[24px] bg-[#f2eadc] p-5 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        Não há uma lista completa em um único mercado para
                        calcular a diferença.
                      </p>
                    )}

                    <p className="flex gap-2 rounded-[20px] bg-white p-4 text-xs leading-5 text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                      <Info className="mt-0.5 size-4 shrink-0" />
                      Deslocamento e entrega não estão incluídos. Confira os
                      preços no mercado.
                    </p>
                    <button
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#ff982e] px-4 text-sm font-extrabold text-white"
                      onClick={() => changeMode("mercados")}
                    >
                      Comparar em um só mercado
                    </button>
                  </aside>
                </>
              )}
            </section>
          )}

          {mode === "lista" && suggestions.length > 0 && !prices.isError && (
            <section className="mt-7 rounded-[30px] bg-[#f2eadc] p-5 dark:bg-slate-900 sm:p-7">
              <h2 className="text-2xl font-black tracking-tight text-brand-700 dark:text-brand-100">
                Quer completar sua lista?
              </h2>
              <p className="mb-5 mt-2 text-sm text-slate-500 dark:text-slate-400">
                Mais opções nas categorias da sua compra. Você escolhe o que
                adicionar.
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
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
