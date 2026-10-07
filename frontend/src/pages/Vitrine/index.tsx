import { HomeEditor } from "@/components/storefront/HomeEditor";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "@/services/api";
import type { Collection } from "@/services/vitrine";
import { useProdutos } from "@/hooks/useProdutos";
import { ImageUpload } from "@/components/storefront/Media";
import { imageUrl } from "@/services/images";
import { ApiError } from "@/components/ui/ApiError";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
const blank = {
  titulo: "",
  descricao: "",
  imagemId: null as string | null,
  produtoIds: [] as number[],
  ativo: true,
  ordem: 0,
};
export default function Vitrine() {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["vitrine", "gestao"],
    queryFn: async () => (await api.get<Collection[]>("/vitrine/gestao")).data,
  });
  const products = useProdutos();
  const [draft, setDraft] = useState<typeof blank & { id?: number }>(blank);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const save = useMutation({
    mutationFn: () =>
      draft.id
        ? api.put(`/vitrine/${draft.id}`, draft)
        : api.post("/vitrine", draft),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["vitrine"] });
      setOpen(false);
      toast.success("Vitrine atualizada.");
    },
    onError: () => toast.error("Não foi possível salvar a coleção."),
  });
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="qt-heading">Uma vitrine que convida.</h1>
          <p className="qt-muted mt-3">
            Escolha a imagem, a mensagem e os produtos de cada coleção.
          </p>
        </div>
        <Button
          disabled={uploading}
          onClick={() => {
            setDraft({ ...blank });
            setOpen(true);
          }}
        >
          Nova coleção
        </Button>
      </div>
      <HomeEditor />
      {open && (
        <form
          className="qt-panel mb-7 grid gap-6 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <ImageUpload
            label="Imagem do banner"
            value={draft.imagemId}
            onChange={(id) => setDraft((d) => ({ ...d, imagemId: id }))}
            onBusy={setUploading}
          />
          <div className="space-y-4">
            <label className="block">
              Título
              <Input
                required
                maxLength={100}
                value={draft.titulo}
                onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
              />
            </label>
            <label className="block">
              Descrição
              <textarea
                className="qt-select !h-24 py-3"
                maxLength={250}
                value={draft.descricao}
                onChange={(e) =>
                  setDraft({ ...draft, descricao: e.target.value })
                }
              />
            </label>
            <label className="block">
              Ordem na vitrine
              <Input
                type="number"
                value={draft.ordem}
                onChange={(e) =>
                  setDraft({ ...draft, ordem: Number(e.target.value) })
                }
              />
            </label>
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={draft.ativo}
                onChange={(e) =>
                  setDraft({ ...draft, ativo: e.target.checked })
                }
              />
              Publicar na vitrine
            </label>
            <fieldset>
              <legend className="mb-2 font-semibold">
                Produtos da coleção
              </legend>
              {products.isError ? (
                <ApiError onRetry={() => void products.refetch()} />
              ) : (
                <div className="max-h-52 space-y-2 overflow-y-auto rounded-xl border p-3">
                  {products.data?.content
                    .filter((p) => p.status === "ACTIVE")
                    .map((p) => (
                      <label
                        key={p.id}
                        className="flex min-h-10 items-center gap-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={draft.produtoIds.includes(Number(p.id))}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              produtoIds: e.target.checked
                                ? [...draft.produtoIds, Number(p.id)]
                                : draft.produtoIds.filter(
                                    (id) => id !== Number(p.id),
                                  ),
                            })
                          }
                        />
                        {p.name} · {p.brand} · {p.unit}
                      </label>
                    ))}
                </div>
              )}
            </fieldset>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={
                  save.isPending ||
                  uploading ||
                  products.isPending ||
                  products.isError
                }
              >
                Salvar coleção
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      )}
      {query.isPending ? (
        <p role="status">Carregando vitrine…</p>
      ) : query.isError ? (
        <ApiError onRetry={() => void query.refetch()} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {query.data?.map((c) => (
            <article key={c.id} className="qt-panel !p-0 overflow-hidden">
              {c.imagemId && (
                <img
                  src={imageUrl(c.imagemId)}
                  alt=""
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="p-6">
                <p className="qt-eyebrow">
                  {c.ativo ? "PUBLICADA" : "RASCUNHO"} · ORDEM {c.ordem}
                </p>
                <h2 className="mt-2 text-xl font-bold">{c.titulo}</h2>
                <p className="qt-muted my-3">{c.descricao}</p>
                <div className="flex gap-3">
                  <Button
                    disabled={uploading}
                    variant="outline"
                    onClick={() => {
                      setDraft(c);
                      setOpen(true);
                    }}
                  >
                    Editar coleção
                  </Button>
                  {c.ativo && (
                    <Link
                      to={`/explorar?colecao=${c.id}`}
                      className="qt-secondary"
                    >
                      Ver como cliente
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="qt-muted mt-6">
        Banners organizam a descoberta. As fotos das ofertas são enviadas pelos
        vendedores, e a comparação continua baseada nos preços registrados.
      </p>
    </div>
  );
}
