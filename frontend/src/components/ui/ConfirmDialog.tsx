import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirmar", loading, onConfirm, onClose }: { open: boolean; title: string; message: string; confirmLabel?: string; loading?: boolean; onConfirm: () => void; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl dark:bg-slate-900"><span className="grid size-11 place-items-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/15"><AlertTriangle className="size-5" /></span><h2 id="dialog-title" className="mt-4 text-lg font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p><div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button><Button variant="danger" onClick={onConfirm} disabled={loading}>{loading ? "Excluindo..." : confirmLabel}</Button></div></div></div>;
}
