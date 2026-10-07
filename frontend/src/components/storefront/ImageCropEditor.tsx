import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export function ImageCropEditor({ file, aspect, onConfirm, onCancel }: {
  file: Blob; aspect: number; onConfirm: (file: File) => Promise<void>; onCancel: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState<HTMLImageElement>();
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    let active = true;
    img.onload = () => { if (active) setSource(img); };
    img.onerror = () => { if (active) setFailed(true); };
    img.src = url;
    return () => { active = false; URL.revokeObjectURL(url); };
  }, [file]);
  useEffect(() => {
    const target = canvas.current;
    if (!target || !source) return;
    const context = target.getContext("2d");
    if (!context) return;
    const scale = Math.max(target.width / source.naturalWidth, target.height / source.naturalHeight) * zoom;
    const width = source.naturalWidth * scale;
    const height = source.naturalHeight * scale;
    context.clearRect(0, 0, target.width, target.height);
    context.drawImage(source, -(width - target.width) * x / 100, -(height - target.height) * y / 100, width, height);
  }, [source, zoom, x, y]);
  async function confirm() {
    if (!canvas.current) return;
    setSaving(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => canvas.current!.toBlob(
        value => value ? resolve(value) : reject(new Error("Imagem inválida")), "image/png"));
      if (blob.size > 3 * 1024 * 1024) throw new Error("Imagem muito grande");
      await onConfirm(new File([blob], "foto-recortada.png", { type: "image/png" }));
    } catch { toast.error("Não foi possível salvar o recorte. Tente novamente."); }
    finally { setSaving(false); }
  }
  return <section className="space-y-4 rounded-2xl border p-4" aria-label="Ajustar imagem">
    <p className="font-semibold">Ajustar enquadramento</p>
    <p className="qt-muted text-sm">Ajuste o zoom e a posição. A área abaixo é o recorte que será salvo.</p>
    {failed ? <p role="alert">Não foi possível abrir esta imagem.</p> : !source && <p role="status">Preparando imagem…</p>}
    <canvas ref={canvas} width={1200} height={Math.round(1200 / aspect)} className="w-full rounded-xl bg-white" style={{ aspectRatio: aspect }} aria-label="Prévia do recorte" />
    <fieldset disabled={!source || saving} className="space-y-3">
      {[
        { label: "Zoom", value: zoom, min: 1, max: 3, step: 0.01, change: setZoom },
        { label: "Posição horizontal", value: x, min: 0, max: 100, step: 1, change: setX },
        { label: "Posição vertical", value: y, min: 0, max: 100, step: 1, change: setY },
      ].map(control => <label key={control.label} className="block text-sm font-semibold">{control.label}
        <input type="range" className="mt-2 block w-full accent-emerald-700" min={control.min} max={control.max} step={control.step} value={control.value} onChange={e => control.change(Number(e.target.value))} />
      </label>)}
      <Button type="button" variant="outline" onClick={() => { setZoom(1); setX(50); setY(50); }}>Centralizar</Button>
    </fieldset>
    <div className="flex flex-wrap gap-3">
      <Button type="button" disabled={!source || saving} onClick={() => void confirm()}>{saving ? "Enviando…" : "Aplicar recorte"}</Button>
      <Button type="button" variant="outline" disabled={saving} onClick={onCancel}>Cancelar</Button>
    </div>
  </section>;
}
