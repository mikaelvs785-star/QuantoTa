import { ImageCropEditor } from "./ImageCropEditor";
import { useState } from "react";
import { Package, Upload } from "lucide-react";
import { api } from "@/services/api";
import toast from "react-hot-toast";
import { imageUrl } from "@/services/images";
export function ProductImage({
  id,
  alt,
  className = "",
}: {
  id?: string | null;
  alt: string;
  className?: string;
}) {
  return id ? (
    <img
      src={imageUrl(id)}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  ) : (
    <div
      className={`qt-photo-placeholder ${className}`}
      role="img"
      aria-label={`${alt}: foto não informada`}
    >
      <Package aria-hidden="true" className="size-8 shrink-0 stroke-[1.5]" />
      <span>Foto não informada</span>
    </div>
  );
}
export function ImageUpload({
  value,
  onChange,
  label = "Foto da oferta",
  onBusy,
  aspect = 1,
}: {
  value?: string | null;
  onChange: (id: string | null) => void;
  label?: string;
  onBusy?: (busy: boolean) => void;
  aspect?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Blob>();
  function finish() { setEditing(undefined); setBusy(false); onBusy?.(false); }
  async function upload(file: File) {
    const form = new FormData();
    form.append("arquivo", file);
    const { data } = await api.post<{ id: string }>("/imagens", form,
      { headers: { "Content-Type": "multipart/form-data" } });
    onChange(data.id);
    finish();
  }
  return (
    <div className="space-y-3">
      <p className="font-semibold">{label}</p>
      {editing ? <ImageCropEditor file={editing} aspect={aspect} onConfirm={upload} onCancel={finish} /> : <div style={{ aspectRatio: aspect }}><ProductImage
        id={value}
        alt={label}
        className="h-full w-full rounded-2xl"
      /></div>}
      <label className="flex min-h-14 cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed p-3 text-sm font-semibold">
        <Upload className="size-5" />
        {busy ? "Ajustando foto…" : "Escolher foto JPG ou PNG"}
        <input
          aria-label={label}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            if (file.size > 3 * 1024 * 1024) {
              toast.error("A foto deve ter até 3 MB.");
              return;
            }
            setBusy(true);
            onBusy?.(true);
            setEditing(file);
          }}
        />
      </label>
      <p className="qt-muted">
        Até 3 MB. Use uma imagem nítida que represente o conteúdo selecionado.
      </p>
      {value && !editing && (
        <button type="button" disabled={busy} className="text-sm underline" onClick={async () => {
          setBusy(true); onBusy?.(true);
          try {
            const { data } = await api.get<Blob>(`/imagens/${encodeURIComponent(value)}`, { responseType: "blob" });
            setEditing(data);
          } catch { toast.error("Não foi possível abrir a foto."); finish(); }
        }}>Ajustar foto atual</button>
      )}
      {value && (
        <button
          type="button"
          className="text-sm underline"
          disabled={busy}
          onClick={() => onChange(null)}
        >
          Remover foto
        </button>
      )}
    </div>
  );
}
