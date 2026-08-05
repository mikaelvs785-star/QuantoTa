import { Barcode, CalendarClock, Edit3, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { Product } from "@/types/product";

function getSafeDate(value?: string) {
  const parsed = new Date(value ?? "");
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function ProductDetails({ product }: { product: Product }) { return <Card><CardContent className="p-6"><div className="flex flex-col gap-5 sm:flex-row"><span className="grid size-24 place-items-center overflow-hidden rounded-2xl bg-slate-100 text-4xl dark:bg-slate-800">{product.imageUrl ? <img src={product.imageUrl} alt="" className="size-full object-cover" /> : "🛒"}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-black">{product.name}</h1><Badge className={product.status === "ACTIVE" ? "" : "bg-slate-100 text-slate-600"}>{product.status === "ACTIVE" ? "Ativo" : "Inativo"}</Badge></div><p className="mt-3 text-slate-500 dark:text-slate-400">{product.description || "Sem descrição cadastrada."}</p></div><Button asChild><Link to={`/admin/produtos/${product.id}/editar`}><Edit3 className="size-4" /> Editar</Link></Button></div><dl className="mt-8 grid gap-5 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4"><div><dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Tags className="size-3.5" /> Categoria</dt><dd className="mt-2 font-bold">{product.category}</dd></div><div><dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Barcode className="size-3.5" /> Código</dt><dd className="mt-2 font-bold">{product.barcode || "—"}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preços cadastrados</dt><dd className="mt-2 font-bold">{product.priceCount}</dd></div><div><dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><CalendarClock className="size-3.5" /> Atualizado</dt><dd className="mt-2 font-bold">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(getSafeDate(product.updatedAt))}</dd></div></dl></CardContent></Card>; }

