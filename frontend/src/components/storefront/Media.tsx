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
}: {
  value?: string | null;
  onChange: (id: string | null) => void;
  label?: string;
  onBusy?: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-3">
      <p className="font-semibold">{label}</p>
      <ProductImage
        id={value}
        alt={label}
        className="h-52 w-full rounded-2xl"
      />
      <label className="flex min-h-14 cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed p-3 text-sm font-semibold">
        <Upload className="size-5" />
        {busy ? "Enviando foto…" : "Escolher foto JPG ou PNG"}
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
            try {
              const form = new FormData();
              form.append("arquivo", file);
              const { data } = await api.post<{ id: string }>(
                "/imagens",
                form,
                { headers: { "Content-Type": "multipart/form-data" } },
              );
              onChange(data.id);
            } catch {
              toast.error(
                "Não foi possível enviar. Use JPG ou PNG de até 3 MB e 4096 pixels por lado.",
              );
            } finally {
              setBusy(false);
              onBusy?.(false);
            }
          }}
        />
      </label>
      <p className="qt-muted">
        Até 3 MB. Use uma imagem nítida que represente o conteúdo selecionado.
      </p>
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
