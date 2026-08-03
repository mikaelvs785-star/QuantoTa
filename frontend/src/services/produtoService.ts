import { api } from "./api";
import type { Product, ProductInput, ProductListParams, ProductListResult } from "@/types/product";

type PageableResponse = { content: Product[]; totalElements: number };

function toListResult(data: Product[] | PageableResponse): ProductListResult {
  return Array.isArray(data) ? { content: data, total: data.length } : { content: data.content, total: data.totalElements };
}

export const produtoService = {
  async listarProdutos(params: ProductListParams = {}) {
    const { data } = await api.get<Product[] | PageableResponse>("/produtos", { params });
    return toListResult(data);
  },
  async buscarProduto(id: string) { const { data } = await api.get<Product>(`/produtos/${id}`); return data; },
  async criarProduto(input: ProductInput) { const { data } = await api.post<Product>("/produtos", input); return data; },
  async editarProduto(id: string, input: ProductInput) { const { data } = await api.put<Product>(`/produtos/${id}`, input); return data; },
  async excluirProduto(id: string) { await api.delete(`/produtos/${id}`); },
};
