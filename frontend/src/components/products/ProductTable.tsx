import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";
export function ProductTable({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="qt-panel hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b text-slate-500">
          <tr>
            {["Produto", "Categoria", "Marca / unidade", "Status", "Ações"].map(
              (label) => (
                <th key={label} className="px-3 py-4 font-medium">
                  {label}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b last:border-0">
              <td className="px-3 py-4 font-semibold">
                <Link to={`/admin/produtos/${product.id}/editar`}>{product.name}</Link>
              </td>
              <td className="px-3 py-4">{product.category}</td>
              <td className="px-3 py-4">
                {[product.brand, product.unit].filter(Boolean).join(" · ") ||
                  "Não informado"}
              </td>
              <td className="px-3 py-4">
                {product.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </td>
              <td className="px-3 py-4">
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/produtos/${product.id}/editar`}>
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product)}
                  >
                    Desativar
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
