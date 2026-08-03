import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Product } from "@/types/product";
export function DeleteProductDialog({ product, loading, onConfirm, onClose }: { product: Product | null; loading: boolean; onConfirm: () => void; onClose: () => void }) { return <ConfirmDialog open={Boolean(product)} title="Excluir produto?" message={`Esta ação removerá ${product?.name ?? "o produto"} permanentemente.`} confirmLabel="Excluir produto" loading={loading} onConfirm={onConfirm} onClose={onClose} />; }
