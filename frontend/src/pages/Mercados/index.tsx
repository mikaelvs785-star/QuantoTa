import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Store, MapPin, Search } from "lucide-react";
import { marketService } from "@/services/marketService";
import { usePrecos } from "@/hooks/usePrecos";
import { currentOffers } from "@/lib/offers";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/components/ui/ApiError";
export default function MercadosPage() {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["mercados", "diretorio"],
    queryFn: () => marketService.listarMercados(),
  });
  const pricesQuery = usePrecos();
  const offers = currentOffers(pricesQuery.data ?? []);
  const markets = (query.data?.content ?? []).filter(
    (m) =>
      m.status === "ACTIVE" &&
      `${m.name} ${m.city} ${m.neighborhood ?? ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(search.toLocaleLowerCase("pt-BR")),
  );
  return (
    <div className="mx-auto max-w-6xl">
      <SectionTitle
        title="Conheça os mercados."
        description="Consulte os endereços e veja quais estabelecimentos têm preços registrados."
      />
      <label className="relative mb-8 block">
        <span className="sr-only">Buscar mercado ou cidade</span>
        <Search className="absolute left-4 top-4 size-5 text-slate-400" />
        <Input
          className="h-14 pl-12"
          placeholder="Busque por mercado, cidade ou bairro"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {query.isPending || pricesQuery.isPending ? (
        <p role="status">Carregando mercados...</p>
      ) : query.isError || pricesQuery.isError ? (
        <ApiError
          onRetry={() => {
            void query.refetch();
            void pricesQuery.refetch();
          }}
        />
      ) : markets.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {markets.map((market) => (
            <article key={market.id} className="qt-panel">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                  <Store className="size-6" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">{market.name}</h2>
                  <p className="qt-muted">
                    {[market.city, market.state].filter(Boolean).join(" / ") ||
                      "Cidade não informada"}
                  </p>
                </div>
              </div>
              <p className="qt-muted mt-6 flex items-start gap-2">
                <MapPin className="mt-1 size-4 shrink-0" />
                {[market.address, market.neighborhood]
                  .filter(Boolean)
                  .join(" · ") || "Endereço não informado"}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-sm font-semibold text-brand-600 dark:text-brand-200">
                  {offers.filter((p) => p.marketId === market.id).length}{" "}
                  produtos com preço
                </p>
                <p className="qt-muted">
                  {market.phone || "Telefone não informado"}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="qt-empty">
          <h2 className="font-semibold">Nenhum mercado encontrado.</h2>
          <p className="qt-muted mt-2">
            Tente outro termo ou consulte novamente quando o catálogo for
            atualizado.
          </p>
        </div>
      )}
    </div>
  );
}
