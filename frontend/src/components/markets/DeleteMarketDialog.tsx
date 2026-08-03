import type { Market } from "@/types/market";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface DeleteMarketDialogProps {
  market: Market | null;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteMarketDialog({ market, loading, onConfirm, onClose }: DeleteMarketDialogProps) {
  return (
    <ConfirmDialog
      open={Boolean(market)}
      title="Excluir mercado?"
      message={`Esta ação removerá ${market?.name ?? "o mercado"} permanentemente.`}
      confirmLabel="Excluir mercado"
      loading={loading}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
