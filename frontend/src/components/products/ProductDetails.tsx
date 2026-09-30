import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";
export function ProductDetails({ product }: { product: Product }) {
  return (
    <section className="qt-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="qt-heading">{product.name}</h1>
        <Button asChild>
          <Link to={`/admin/produtos/${product.id}/editar`}>
            Editar produto
          </Link>
        </Button>
      </div>
      <p className="qt-muted mt-4">
        {product.description || "Sem descrição cadastrada."}
      </p>
      <dl className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2">
        {[
          ["Categoria", product.category],
          ["Marca", product.brand || "Não informada"],
          ["Unidade / embalagem", product.unit || "Não informada"],
          ["Status", product.status === "ACTIVE" ? "Ativo" : "Inativo"],
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
