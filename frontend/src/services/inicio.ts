import { api } from "./api";
export interface HomeContent {
  titulo: string;
  descricao: string;
  imagemId: string | null;
  categorias: { label: string; query: string; imagemId: string | null }[];
}
export const getHomeContent = async () => (await api.get<HomeContent>("/vitrine/inicio")).data;
export const saveHomeContent = async (content: HomeContent) => (await api.put<HomeContent>("/vitrine/inicio", content)).data;
