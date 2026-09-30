import { api } from "./api";
import { currentOffers } from "@/lib/offers";
import type { DashboardData, PriceRecord } from "@/types/dashboard";

type BackendProduct = {
  id: number;
  nome: string;
  categoria?: string;
  descricao?: string;
  ativo?: boolean;
};
type BackendMarket = { id: number; nome: string; ativo?: boolean };
type BackendPrice = {
  id: number;
  produto: BackendProduct;
  mercado: BackendMarket;
  valor: number;
  dataColeta: string;
};

export async function getPrecos(): Promise<PriceRecord[]> {
  const { data } = await api.get<BackendPrice[]>("/precos");
  return data
    .filter((p) => p.produto?.ativo !== false && p.mercado?.ativo !== false)
    .map((p) => ({
      id: String(p.id),
      productId: String(p.produto.id),
      marketId: String(p.mercado.id),
      product: p.produto.nome,
      market: p.mercado.nome,
      price: Number(p.valor),
      date: p.dataColeta,
    }));
}
export async function getDashboard(): Promise<DashboardData> {
  const [productsResponse, marketsResponse, prices] = await Promise.all([
    api.get<BackendProduct[]>("/produtos"),
    api.get<BackendMarket[]>("/mercados"),
    getPrecos(),
  ]);
  const products = productsResponse.data.filter((p) => p.ativo !== false);
  const markets = marketsResponse.data.filter((m) => m.ativo !== false);
  const offers = currentOffers(prices);
  return {
    metrics: [
      {
        key: "products",
        label: "Produtos no catálogo",
        value: products.length,
      },
      { key: "markets", label: "Mercados cadastrados", value: markets.length },
      { key: "prices", label: "Preços disponíveis", value: offers.length },
    ],
    latestPrices: [...offers]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8),
  };
}
