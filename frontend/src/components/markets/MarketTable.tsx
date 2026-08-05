import type { Market } from "@/types/market";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface MarketTableProps {
  markets: Market[];
  onEdit: (market: Market) => void;
  onDelete: (market: Market) => void;
}

export function MarketTable({ markets, onEdit, onDelete }: MarketTableProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-6 py-4">Nome</th>
            <th className="px-6 py-4">Cidade</th>
            <th className="px-6 py-4">CNPJ</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {markets.map((market) => (
            <tr key={market.id} className="group hover:bg-slate-50">
              <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{market.name}</td>
              <td className="px-6 py-4 text-slate-600">{market.city}</td>
              <td className="px-6 py-4 text-slate-600">{market.cnpj}</td>
              <td className="px-6 py-4">
                <Badge className={market.status === "ACTIVE" ? "" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}>
                  {market.status === "ACTIVE" ? "Ativo" : "Inativo"}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(market)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(market)}>
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
