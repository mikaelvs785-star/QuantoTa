import { PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function MarketEmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
        <PackagePlus />
      </span>
      <h2 className="mt-5 text-lg font-bold text-slate-900">Nenhum mercado encontrado</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">Cadastre ou busque um mercado para começar a comparar informações e preços.</p>
      <Button asChild className="mt-5">
        <Link to="/mercados/novo">Adicionar mercado</Link>
      </Button>
    </div>
  );
}
