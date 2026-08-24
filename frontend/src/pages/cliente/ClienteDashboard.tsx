import { CircleDollarSign, ListChecks, ScanSearch } from "lucide-react";

import Dashboard from "../Dashboard";

export default function ClienteDashboard() {
  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <CircleDollarSign className="mb-2 size-6 text-green-600" />

          <h2 className="font-semibold">
            Economize nas compras
          </h2>

          <p className="text-sm text-slate-500">
            Compare preços antes de comprar.
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <ListChecks className="mb-2 size-6 text-blue-600" />

          <h2 className="font-semibold">
            Sua lista
          </h2>

          <p className="text-sm text-slate-500">
            Organize sua lista de compras.
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <ScanSearch className="mb-2 size-6 text-orange-500" />

          <h2 className="font-semibold">
            Compare produtos
          </h2>

          <p className="text-sm text-slate-500">
            Encontre o menor preço.
          </p>
        </div>
      </div>

      <Dashboard />
    </div>
  );
}