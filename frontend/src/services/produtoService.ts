import { api } from "./api";
import type { Product, ProductInput, ProductListParams, ProductListResult } from "@/types/product";

type BackendProduct = {
  id: number;
  nome: string;
  categoria?: string;
  unidadeMedida?: string;
  marca?: string;
  descricao?: string;
  ativo?: boolean;
};
type PageableResponse = { content: BackendProduct[]; totalElements: number };

function toFrontendProduct(product: BackendProduct): Product {
  return {
    id: String(product.id),
    name: product.nome,
    category: product.categoria ?? "Sem categoria",
    description: product.descricao,
    barcode: undefined,
    imageUrl: undefined,
    status: product.ativo === false ? "INACTIVE" : "ACTIVE",
    priceCount: 0,
    updatedAt: new Date().toISOString(),
  };
}

function toListResult(data: BackendProduct[] | PageableResponse): ProductListResult {
  if (Array.isArray(data)) {
    return { content: data.map(toFrontendProduct), total: data.length };
  }

  return { content: data.content.map(toFrontendProduct), total: data.totalElements };
}

export const produtoService = {
  async listarProdutos(params: ProductListParams = {}) {
    const { data } = await api.get<BackendProduct[] | PageableResponse>("/produtos", { params });
    return toListResult(data);
  },
  async buscarProduto(id: string) {
    const { data } = await api.get<BackendProduct>(`/produtos/${id}`);
    return toFrontendProduct(data);
  },
  async criarProduto(input: ProductInput) {
    const payload = {
      nome: input.name,
      categoria: input.category,
      descricao: input.description,
      marca: input.barcode,
      ativo: input.status === "ACTIVE",
    };
    const { data } = await api.post<BackendProduct>("/produtos", payload);
    return toFrontendProduct(data);
  },
  async editarProduto(id: string, input: ProductInput) {
    const payload = {
      nome: input.name,
      categoria: input.category,
      descricao: input.description,
      marca: input.barcode,
      ativo: input.status === "ACTIVE",
    };
    const { data } = await api.put<BackendProduct>(`/produtos/${id}`, payload);
    return toFrontendProduct(data);
  },
  async excluirProduto(id: string) { await api.delete(`/produtos/${id}`); },
};
