import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import type { Market } from "@/types/market";
export function MarketDetails({ market }: { market: Market }) {
  return (
    <section className="qt-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="qt-heading">{market.name}</h1>
        <Button asChild>
          <Link to={`/admin/mercados/${market.id}/editar`}>Editar mercado</Link>
        </Button>
      </div>
      <dl className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2">
        {[
          ["Endereço", market.address || "Não informado"],
          ["Bairro", market.neighborhood || "Não informado"],
          ["Cidade / estado", `${market.city} / ${market.state}`],
          ["Telefone", market.phone || "Não informado"],
          ["Status", market.status === "ACTIVE" ? "Ativo" : "Inativo"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="qt-muted">{label}</dt>
            <dd className="mt-2 font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
