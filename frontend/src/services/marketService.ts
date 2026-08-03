import { api } from "./api";
import type { Market, MarketInput, MarketListParams, MarketListResult } from "@/types/market";

type PageableResponse = { content: any[]; totalElements: number };

type MarketResponse = Record<string, any>;

function normalizeMarket(market: MarketResponse): Market {
  return {
    id: String(market.id),
    name: market.name ?? market.nome ?? "",
    cnpj: market.cnpj ?? market.cnpj_mercado,
    phone: market.phone ?? market.telefone ?? "",
    email: market.email,
    website: market.website ?? market.site,
    logoUrl: market.logoUrl ?? market.logo,
    cep: market.cep,
    address: market.address ?? market.endereco,
    number: market.number ?? market.numero,
    complement: market.complement ?? market.complemento,
    neighborhood: market.neighborhood ?? market.bairro,
    city: market.city ?? market.cidade ?? "",
    state: market.state ?? market.estado ?? "",
    latitude: market.latitude,
    longitude: market.longitude,
    description: market.description ?? market.descricao,
    productCount: Number(market.productCount ?? market.produtoCount ?? 0),
    priceCount: Number(market.priceCount ?? 0),
    status: market.status ?? (market.ativo === false ? "INACTIVE" : "ACTIVE"),
    updatedAt: market.updatedAt ?? market.updatedAt ?? new Date().toISOString(),
    ativo: market.ativo,
  };
}

function toListResult(data: MarketResponse[] | PageableResponse): MarketListResult {
  const content = Array.isArray(data) ? data.map(normalizeMarket) : data.content.map(normalizeMarket);
  return { content, total: Array.isArray(data) ? content.length : data.totalElements };
}

function buildPayload(input: MarketInput) {
  return {
    nome: input.name,
    cnpj_mercado: input.cnpj,
    telefone: input.phone,
    email: input.email,
    website: input.website,
    logoUrl: input.logoUrl,
    cep: input.cep,
    endereco: input.address,
    numero: input.number,
    complemento: input.complement,
    bairro: input.neighborhood,
    cidade: input.city,
    estado: input.state,
    latitude: input.latitude,
    longitude: input.longitude,
    descricao: input.description,
    ativo: input.status === "ACTIVE",
  };
}

export const marketService = {
  async listarMercados(params: MarketListParams = {}) {
    const { data } = await api.get<MarketResponse[] | PageableResponse>("/mercados", { params });
    return toListResult(data);
  },

  async buscarMercado(id: string) {
    const { data } = await api.get<MarketResponse>(`/mercados/${id}`);
    return normalizeMarket(data);
  },

  async criarMercado(input: MarketInput) {
    const { data } = await api.post<MarketResponse>("/mercados", buildPayload(input));
    return normalizeMarket(data);
  },

  async editarMercado(id: string, input: MarketInput) {
    const { data } = await api.put<MarketResponse>(`/mercados/${id}`, buildPayload(input));
    return normalizeMarket(data);
  },

  async excluirMercado(id: string) {
    await api.delete(`/mercados/${id}`);
  },
};
