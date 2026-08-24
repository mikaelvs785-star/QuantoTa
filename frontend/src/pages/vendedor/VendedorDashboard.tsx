import { Package, Store, Tags, TrendingUp } from "lucide-react";

import Dashboard from "../Dashboard";

export default function VendedorDashboard() {
  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border p-4">
          <Package className="mb-2 size-6 text-blue-600" />

          <h2 className="font-semibold">
            Produtos
          </h2>

          <p className="text-sm text-slate-500">
            Gerencie os produtos cadastrados.
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <Tags className="mb-2 size-6 text-green-600" />

          <h2 className="font-semibold">
            Preços
          </h2>

          <p className="text-sm text-slate-500">
            Atualize os preços do seu mercado.
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <Store className="mb-2 size-6 text-orange-500" />

          <h2 className="font-semibold">
            Meu mercado
          </h2>

          <p className="text-sm text-slate-500">
            Consulte os dados do estabelecimento.
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <TrendingUp className="mb-2 size-6 text-purple-600" />

          <h2 className="font-semibold">
            Desempenho
          </h2>

          <p className="text-sm text-slate-500">
            Acompanhe os preços cadastrados.
          </p>
        </div>
      </div>

      <Dashboard />
    </div>
  );
}