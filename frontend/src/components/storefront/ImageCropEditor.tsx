import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export function ImageCropEditor({ file, aspect, onConfirm, onCancel }: {
  file: Blob; aspect: number; onConfirm: (file: File) => Promise<void>; onCancel: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ pointer: number; left: number; top: number; x: number; y: number } | null>(null);
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
    <p className="qt-muted text-sm">Arraste a foto para posicionar e use o zoom para aproximar. A área abaixo será salva.</p>
    {failed ? <p role="alert">Não foi possível abrir esta imagem.</p> : !source && <p role="status">Preparando imagem…</p>}
    <canvas ref={canvas} width={1200} height={Math.round(1200 / aspect)} className="w-full rounded-xl bg-white" aria-label="Prévia do recorte. Arraste para reposicionar." 
      style={{ aspectRatio: aspect, touchAction: "none", cursor: saving ? "wait" : "grab" }}
      tabIndex={0}
      onKeyDown={event => {
        if (saving) return;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) event.preventDefault();
        if (event.key === "ArrowLeft") setX(value => Math.max(0, value - 2));
        if (event.key === "ArrowRight") setX(value => Math.min(100, value + 2));
        if (event.key === "ArrowUp") setY(value => Math.max(0, value - 2));
        if (event.key === "ArrowDown") setY(value => Math.min(100, value + 2));
      }}
      onPointerDown={event => {
        if (!source || saving) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { pointer: event.pointerId, left: event.clientX, top: event.clientY, x, y };
      }}
      onPointerMove={event => {
        const start = drag.current;
        const target = canvas.current;
        if (!start || start.pointer !== event.pointerId || !source || !target || saving) return;
        const rect = target.getBoundingClientRect();
        const scale = Math.max(target.width / source.naturalWidth, target.height / source.naturalHeight) * zoom;
        const excessX = (source.naturalWidth * scale - target.width) * rect.width / target.width;
        const excessY = (source.naturalHeight * scale - target.height) * rect.height / target.height;
        const clamp = (value: number) => Math.max(0, Math.min(100, value));
        if (excessX > 0.1) setX(clamp(start.x - (event.clientX - start.left) / excessX * 100));
        if (excessY > 0.1) setY(clamp(start.y - (event.clientY - start.top) / excessY * 100));
      }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onLostPointerCapture={() => { drag.current = null; }} />
    <fieldset disabled={!source || saving} className="space-y-3">
      {[
        { label: "Zoom", value: zoom, min: 1, max: 3, step: 0.01, change: setZoom },

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
