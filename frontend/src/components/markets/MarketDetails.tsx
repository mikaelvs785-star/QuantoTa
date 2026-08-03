import { ArrowRight, CalendarClock, MapPin, Phone, Tag, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { Market } from "@/types/market";

export function MarketDetails({ market }: { market: Market }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-slate-100 text-4xl text-slate-700">
            {market.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900">{market.name}</h1>
              <Badge className={market.status === "ACTIVE" ? "" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}>
                {market.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="mt-3 text-slate-600">{market.description || "Sem descrição cadastrada."}</p>
          </div>
          <Button asChild>
            <Link to={`/mercados/${market.id}/editar`}>
              <ArrowRight className="size-4" /> Editar
            </Link>
          </Button>
        </div>

        <dl className="mt-8 grid gap-5 border-t pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Tag className="size-3.5" /> CNPJ
            </dt>
            <dd className="mt-2 font-bold text-slate-900">{market.cnpj || "—"}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Phone className="size-3.5" /> Telefone
            </dt>
            <dd className="mt-2 font-bold text-slate-900">{market.phone}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <MapPin className="size-3.5" /> Localização
            </dt>
            <dd className="mt-2 font-bold text-slate-900">{market.city}, {market.state}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Wallet className="size-3.5" /> Produtos cadastrados
            </dt>
            <dd className="mt-2 font-bold text-slate-900">{market.productCount}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <CalendarClock className="size-3.5" /> Atualizado
            </dt>
            <dd className="mt-2 font-bold text-slate-900">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(market.updatedAt))}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <ArrowRight className="size-3.5" /> Site
            </dt>
            <dd className="mt-2 font-bold text-slate-900">{market.website || "—"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
