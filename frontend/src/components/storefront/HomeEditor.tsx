import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getHomeContent, saveHomeContent, type HomeContent } from "@/services/inicio";
import { ImageUpload } from "./Media";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/components/ui/ApiError";

export function HomeEditor() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["inicio"], queryFn: getHomeContent });
  const [draft, setDraft] = useState<HomeContent | null>(null);
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const content = draft ?? query.data;
  const uploading = Object.values(uploads).some(Boolean);
  const save = useMutation({
    mutationFn: () => saveHomeContent(content!),
    onSuccess: (value) => {
      client.setQueryData(["inicio"], value);
      setDraft(null);
      toast.success("Página inicial atualizada.");
    },
    onError: () => toast.error("Não foi possível salvar a página inicial."),
  });
  if (query.isPending) return <p role="status">Carregando página inicial…</p>;
  if (query.isError || !content) return <ApiError onRetry={() => void query.refetch()} />;
  const updateCategory = (index: number, change: Partial<HomeContent["categorias"][number]>) =>
    setDraft((current) => {
      const latest = current ?? content;
      return { ...latest, categorias: latest.categorias.map((category, i) => i === index ? { ...category, ...change } : category) };
    });
  return (
    <form className="qt-panel mb-8 space-y-5" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}>
      <div><h2 className="text-2xl font-bold">Banner principal e categorias</h2>
        <p className="qt-muted mt-2">Personalize a primeira área que o cliente vê ao entrar.</p></div>
      <fieldset disabled={save.isPending} className="space-y-5">
        <ImageUpload label="Imagem do banner principal" value={content.imagemId}
          onChange={(imagemId) => setDraft((current) => ({ ...(current ?? content), imagemId }))}
          onBusy={(busy) => setUploads((old) => ({ ...old, banner: busy }))} />
        <label className="block">Título do banner
          <textarea className="qt-select !h-24 py-3" required maxLength={150} value={content.titulo}
            onChange={(event) => setDraft({ ...content, titulo: event.target.value })} />
        </label>
        <label className="block">Descrição
          <textarea className="qt-select !h-24 py-3" required maxLength={300} value={content.descricao}
            onChange={(event) => setDraft({ ...content, descricao: event.target.value })} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          {content.categorias.map((category, index) => (
            <fieldset key={index} className="rounded-2xl border p-4 space-y-3">
              <legend className="px-2 font-bold">Categoria {index + 1}</legend>
              <label className="block">Nome
                <Input required maxLength={60} value={category.label} onChange={(event) => updateCategory(index, { label: event.target.value })} />
              </label>
              <label className="block">Busca ao clicar
                <Input required maxLength={100} value={category.query} onChange={(event) => updateCategory(index, { query: event.target.value })} />
              </label>
              <ImageUpload label="Imagem da categoria" value={category.imagemId}
                onChange={(imagemId) => updateCategory(index, { imagemId })}
                onBusy={(busy) => setUploads((old) => ({ ...old, [index]: busy }))} />
            </fieldset>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={save.isPending || uploading}>{save.isPending ? "Salvando…" : "Salvar página inicial"}</Button>
        <Button type="button" variant="outline" disabled={save.isPending || uploading} onClick={() => setDraft(null)}>Descartar alterações</Button>
        <a href="/" className="qt-secondary">Ver página inicial</a>
      </div>
    </form>
  );
}
