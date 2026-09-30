import type { Market } from "@/types/market";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface DeleteMarketDialogProps {
  market: Market | null;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteMarketDialog({
  market,
  loading,
  onConfirm,
  onClose,
}: DeleteMarketDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(market)}
      title="Desativar mercado?"
      message={`Esta ação desativará ${market?.name ?? "o mercado"} no catálogo. Os registros anteriores serão preservados.`}
      confirmLabel="Desativar mercado"
      loading={loading}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
