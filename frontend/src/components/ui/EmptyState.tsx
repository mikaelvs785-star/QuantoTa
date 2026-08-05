import { PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

export function EmptyState({ title = "Nenhum resultado encontrado", description = "Quando houver dados, eles aparecerão aqui.", action = true }: { title?: string; description?: string; action?: boolean }) {
  return <div className="flex min-h-52 flex-col items-center justify-center p-6 text-center"><span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15"><PackagePlus className="size-6" /></span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>{action && <Button asChild size="sm" className="mt-4"><Link to="/admin/produtos">Cadastrar primeiro produto</Link></Button>}</div>;
}

