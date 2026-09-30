import { useQuery } from "@tanstack/react-query";
import { Package, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { getProdutos } from "@/services/dashboard";

export default function ProdutosAdmin() {
  const [search, setSearch] = useState("");

  const {
    data: produtos = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin", "produtos"],
    queryFn: getProdutos,
  });

  const produtosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();

    if (!termo) {
      return produtos;
    }

    return produtos.filter((produto) =>
      [
        produto.name,
        produto.category,
        produto.description ?? "",
        produto.barcode ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    );
  }, [produtos, search]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="size-6 text-blue-600" />

            <h1 className="text-2xl font-bold text-slate-900">
              Produtos
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Gerencie os produtos cadastrados no QuantoTá.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`size-4 ${isFetching ? "animate-spin" : ""}`}
          />

          Atualizar
        </button>
      </div>

      {/* Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pesquisar produto..."
          className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Erro */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-700">
            Não foi possível carregar os produtos.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Verifique se o backend está funcionando e tente novamente.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      )}

      {/* Lista */}
      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {produtosFiltrados.length} produto
              {produtosFiltrados.length !== 1 ? "s" : ""}
              {search ? " encontrado(s)" : " cadastrado(s)"}
            </p>
          </div>

          {produtosFiltrados.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Package className="mx-auto size-10 text-slate-300" />

              <h2 className="mt-3 font-semibold text-slate-800">
                Nenhum produto encontrado
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Tente pesquisar por outro nome ou categoria."
                  : "Ainda não existem produtos cadastrados."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {produtosFiltrados.map((produto) => (
                <article
                  key={produto.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Package className="size-5 text-blue-600" />
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        produto.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {produto.status === "ACTIVE"
                        ? "Ativo"
                        : "Inativo"}
                    </span>
                  </div>

                  <h2 className="mt-4 font-semibold text-slate-900">
                    {produto.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {produto.category}
                  </p>

                  {produto.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                      {produto.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <span>ID: {produto.id}</span>

                    <span>
                      {produto.priceCount} preço
                      {produto.priceCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}