import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/services/api";
import { ProductImage } from "@/components/storefront/Media";
import { Button } from "@/components/ui/Button";

export function SellerProductImageEditor({ productId, productName, imageId }: {
  productId: string; productName: string; imageId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const client = useQueryClient();

  function close() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null); setFile(null); setOpen(false);
  }

  async function save() {
    if (!file) return;
    setSaving(true);
    try {
      const form = new FormData();
      form.append("arquivo", file);
      const uploaded = await api.post<{ id: string }>("/imagens", form);
      await api.put(`/produtos/${productId}/imagem`, { imagemId: uploaded.data.id });
      await Promise.all([
        client.invalidateQueries({ queryKey: ["produtos"] }),
        client.invalidateQueries({ queryKey: ["precos"] }),
      ]);
      toast.success("Imagem do produto atualizada.");
      close();
    } catch {
      toast.error("Não foi possível atualizar a imagem. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return <>
    <Button size="lg" variant="outline" onClick={() => setOpen(true)}>
      <ImagePlus className="size-4" /> Alterar imagem
    </Button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && !saving) close(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby={`image-title-${productId}`} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={`image-title-${productId}`} className="text-lg font-bold">Imagem de {productName}</h2>
          <button type="button" aria-label="Fechar" disabled={saving} onClick={close}><X className="size-5" /></button>
        </div>
        <div className="mx-auto mb-4 aspect-square max-h-56 max-w-56 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          {preview ? <img src={preview} alt={`Prévia de ${productName}`} className="h-full w-full object-contain" /> : <ProductImage id={imageId} alt={productName} className="h-full w-full object-contain" />}
        </div>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-semibold">Escolher nova imagem (JPG ou PNG, até 3 MB)</span>
          <input type="file" accept="image/jpeg,image/png" disabled={saving} className="block w-full text-sm" onChange={e => {
            const selected = e.target.files?.[0] ?? null;
            if (!selected) return;
            if (selected.size > 3 * 1024 * 1024) { toast.error("A imagem deve ter até 3 MB."); e.currentTarget.value = ""; return; }
            if (preview) URL.revokeObjectURL(preview);
            setFile(selected); setPreview(URL.createObjectURL(selected));
          }} />
        </label>
        <p className="mb-4 text-xs text-slate-500">A imagem será compartilhada por todos os mercados que oferecem este produto. Nenhum preço ou dado cadastral será alterado.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={saving} onClick={close}>Cancelar</Button>
          <Button disabled={!file || saving} onClick={() => void save()}>{saving ? "Salvando…" : "Salvar imagem"}</Button>
        </div>
      </section>
    </div>}
  </>;
}
