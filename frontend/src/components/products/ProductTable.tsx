import { Edit3, Eye, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";

function getSafeDate(value?: string) {
  const parsed = new Date(value ?? "");
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function ProductTable({ products, onDelete }: { products: Product[]; onDelete: (product: Product) => void }) {
  return <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-190 text-left text-sm"><thead className="border-y text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-3 font-semibold">Produto</th><th className="px-3 py-3 font-semibold">Categoria</th><th className="px-3 py-3 font-semibold">Preços</th><th className="px-3 py-3 font-semibold">Atualização</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 text-right font-semibold">Ações</th></tr></thead><tbody>{products.map((product, index) => <motion.tr key={product.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .025 }} className="border-b transition hover:bg-slate-50 dark:hover:bg-slate-800/60"><td className="px-3 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center overflow-hidden rounded-lg bg-slate-100 text-lg dark:bg-slate-800">{product.imageUrl ? <img src={product.imageUrl} alt="" className="size-full object-cover" /> : "🛒"}</span><Link to={`/admin/produtos/${product.id}`} className="font-semibold hover:text-brand-600">{product.name}</Link></div></td><td className="px-3 py-4 text-slate-500">{product.category}</td><td className="px-3 py-4">{product.priceCount}</td><td className="px-3 py-4 text-slate-500">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(getSafeDate(product.updatedAt))}</td><td className="px-3 py-4"><Badge className={product.status === "ACTIVE" ? "" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}>{product.status === "ACTIVE" ? "Ativo" : "Inativo"}</Badge></td><td className="px-3 py-4"><div className="flex justify-end gap-1"><Button asChild variant="ghost" size="icon" aria-label={`Ver ${product.name}`}><Link to={`/admin/produtos/${product.id}`}><Eye className="size-4" /></Link></Button><Button asChild variant="ghost" size="icon" aria-label={`Editar ${product.name}`}><Link to={`/admin/produtos/${product.id}/editar`}><Edit3 className="size-4" /></Link></Button><Button variant="ghost" size="icon" aria-label={`Excluir ${product.name}`} onClick={() => onDelete(product)}><Trash2 className="size-4 text-red-600" /></Button></div></td></motion.tr>)}</tbody></table></div>; }

