import { api } from "./api";
export interface ShoppingList {
  id: number;
  nomeLista: string;
  dataCriacao: string;
  itens: {
    id: number;
    produto: {
      id: number;
      nome: string;
      marca?: string;
      unidadeMedida?: string;
      ativo: boolean;
    };
    quantidade: number;
  }[];
}
export interface ListSummary {
  valorEstimado: number;
  itensSemPreco: number;
  estimativaCompleta: boolean;
  estimativas: {
    itemId: number;
    precoUnitario: number | null;
    subtotal: number | null;
    mercadoId: number | null;
    mercado: string | null;
  }[];
}
export const listsService = {
  async summary(id: number) {
    return (await api.get<ListSummary>(`/listas/${id}`)).data;
  },
  async getAll() {
    const { data } = await api.get<ShoppingList[]>("/listas");
    return data;
  },
  async create(name: string) {
    const { data } = await api.post<ShoppingList>("/listas", {
      nomeLista: name,
    });
    return data;
  },
  async add(listId: number, productId: string, quantity: number) {
    await api.post(`/listas/${listId}/itens`, {
      produtoId: Number(productId),
      quantidade: quantity,
    });
  },
  async update(listId: number, itemId: number, quantity: number) {
    await api.put(`/listas/${listId}/itens/${itemId}`, {
      quantidade: quantity,
    });
  },
  async remove(listId: number, itemId: number) {
    await api.delete(`/listas/${listId}/itens/${itemId}`);
  },
};
