import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Product } from "@/types/product";
export function DeleteProductDialog({
  product,
  loading,
  onConfirm,
  onClose,
}: {
  product: Product | null;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <ConfirmDialog
      open={Boolean(product)}
      title="Desativar produto?"
      message={`Esta ação desativará ${product?.name ?? "o produto"} no catálogo. Os registros anteriores serão preservados.`}
      confirmLabel="Desativar produto"
      loading={loading}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
