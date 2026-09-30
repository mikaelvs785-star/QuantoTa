import { api } from "./api";
import type { Market, MarketInput, MarketListParams } from "@/types/market";
type BackendMarket = {
  id: number;
  nome: string;
  telefone?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  ativo: boolean;
};
function normalizeMarket(market: BackendMarket): Market {
  return {
    id: String(market.id),
    name: market.nome,
    phone: market.telefone ?? "",
    address: market.endereco,
    neighborhood: market.bairro,
    city: market.cidade ?? "",
    state: market.estado ?? "",
    status: market.ativo === false ? "INACTIVE" : "ACTIVE",
  };
}
function payload(input: MarketInput) {
  return {
    vendedorId: input.vendedorId ? Number(input.vendedorId) : null,
    nome: input.name,
    telefone: input.phone,
    endereco: input.address,
    bairro: input.neighborhood,
    cidade: input.city,
    estado: input.state,
    ativo: input.status === "ACTIVE",
  };
}
export const marketService = {
  async listarMercados(params: MarketListParams = {}) {
    const { data } = await api.get<BackendMarket[]>("/mercados", { params });
    return { content: data.map(normalizeMarket), total: data.length };
  },
  async buscarMercado(id: string) {
    const { data } = await api.get<BackendMarket>(`/mercados/${id}`);
    return normalizeMarket(data);
  },
  async criarMercado(input: MarketInput) {
    const { data } = await api.post<BackendMarket>("/mercados", payload(input));
    return normalizeMarket(data);
  },
  async editarMercado(id: string, input: MarketInput) {
    const { data } = await api.put<BackendMarket>(
      `/mercados/${id}`,
      payload(input),
    );
    return normalizeMarket(data);
  },
  async excluirMercado(id: string) {
    await api.delete(`/mercados/${id}`);
  },
};
