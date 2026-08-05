import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Market } from "@/types/market";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface MarketCardProps {
  market: Market;
  onDelete: (market: Market) => void;
}

export function MarketCard({ market, onDelete }: MarketCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-lg font-semibold text-slate-600">
          {market.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{market.name}</h3>
              <p className="text-sm text-slate-600">{market.city} • {market.state}</p>
            </div>
            <Badge className={market.status === "ACTIVE" ? "" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}>
              {market.status === "ACTIVE" ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-slate-600">CNPJ: {market.cnpj ?? "—"}</p>
          <p className="mt-1 text-sm text-slate-600">Telefone: {market.phone || "Não informado"}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link to={`/admin/mercados/${market.id}/editar`}>Editar</Link>
            </Button>
            <Button size="sm" variant="danger" onClick={() => onDelete(market)}>
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

