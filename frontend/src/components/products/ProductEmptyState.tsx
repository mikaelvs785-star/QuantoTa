import { Link } from "react-router-dom";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
export function ProductEmptyState() { return <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/15"><PackagePlus className="size-7" /></span><h2 className="mt-5 text-lg font-bold">Nenhum produto encontrado</h2><p className="mt-2 max-w-sm text-sm text-slate-500">Cadastre seu primeiro produto para começar a comparar preços.</p><Button asChild className="mt-5"><Link to="/admin/produtos/novo">Cadastrar primeiro produto</Link></Button></div>; }

