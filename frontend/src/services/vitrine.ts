import { api } from "./api";
export interface Collection {
  id: number;
  titulo: string;
  descricao: string;
  imagemId: string | null;
  produtoIds: number[];
  ativo: boolean;
  ordem: number;
}
export const getCollections = async () =>
  (await api.get<Collection[]>("/vitrine")).data;
