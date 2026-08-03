import { isAxiosError } from "axios";
import { api } from "./api";
import type { DashboardData, FavoriteMarket, MonitoredProduct, PriceRecord } from "@/types/dashboard";

type PayloadEnvelope<T> = { value?: T[]; Count?: number };
type BackendProduct = { id: number; nome: string; categoria?: string; marca?: string; descricao?: string; ativo?: boolean };
type BackendMarket = { id: number; nome: string; cidade?: string; estado?: string; bairro?: string; endereco?: string; telefone?: string; ativo?: boolean };
type BackendPrice = { id: number; produto?: BackendProduct; mercado?: BackendMarket; valor?: number; dataColeta?: string; dataCadastro?: string };

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && Array.isArray((payload as PayloadEnvelope<T>).value)) {
    return (payload as PayloadEnvelope<T>).value as T[];
  }
  return [];
}

export async function getDashboard() {
  try {
    const { data } = await api.get<DashboardData>("/dashboard");
    return data;
  } catch (error) {
    if (!isAxiosError(error) || error.response?.status !== 404) throw error;

    const [productsResponse, marketsResponse, pricesResponse] = await Promise.all([
      api.get<PayloadEnvelope<BackendProduct> | BackendProduct[]>("/produtos"),
      api.get<PayloadEnvelope<BackendMarket> | BackendMarket[]>("/mercados"),
      api.get<PayloadEnvelope<BackendPrice> | BackendPrice[]>("/precos"),
    ]);

    const products = unwrapList<BackendProduct>(productsResponse.data);
    const markets = unwrapList<BackendMarket>(marketsResponse.data);
    const prices = unwrapList<BackendPrice>(pricesResponse.data);

    const latestPrices: PriceRecord[] = prices.map((price) => ({
      id: String(price.id),
      product: price.produto?.nome ?? "Produto",
      market: price.mercado?.nome ?? "Mercado",
      price: Number(price.valor ?? 0),
      date: price.dataColeta ?? price.dataCadastro ?? new Date().toISOString(),
    }));

    const favoriteMarkets: FavoriteMarket[] = markets.map((market, index) => {
      const marketPrices = prices.filter((price) => price.mercado?.id === market.id);
      const bestPrice = marketPrices.length > 0 ? Math.min(...marketPrices.map((price) => Number(price.valor ?? 0))) : 0;
      return {
        id: String(market.id),
        name: market.nome,
        productCount: marketPrices.length,
        bestPrice,
        distance: index + 1,
      };
    });

    const monitoredProducts: MonitoredProduct[] = products.map((product) => {
      const productPrices = prices.filter((price) => price.produto?.id === product.id);
      const lowestPrice = productPrices.length > 0 ? Math.min(...productPrices.map((price) => Number(price.valor ?? 0))) : 0;
      const highestPrice = productPrices.length > 0 ? Math.max(...productPrices.map((price) => Number(price.valor ?? 0))) : 0;
      return {
        id: String(product.id),
        name: product.nome,
        imageUrl: undefined,
        lowestPrice,
        highestPrice,
        savings: Math.max(highestPrice - lowestPrice, 0),
      };
    });

    return {
      metrics: [
        { key: "products", label: "Produtos", value: products.length, variation: 4 },
        { key: "markets", label: "Mercados", value: markets.length, variation: 2 },
        { key: "prices", label: "Preços", value: prices.length, variation: 6 },
        { key: "lists", label: "Listas", value: 2, variation: 1 },
        { key: "savings", label: "Economia", value: 126.4, variation: 8 },
        { key: "monitored", label: "Monitorados", value: monitoredProducts.length, variation: 3 },
      ],
      monthlySavings: [
        { month: "Jan", value: 85 },
        { month: "Fev", value: 110 },
        { month: "Mar", value: 95 },
        { month: "Abr", value: 138 },
      ],
      popularProducts: [
        { name: "Arroz", searches: 26 },
        { name: "Leite", searches: 18 },
        { name: "Banana", searches: 14 },
      ],
      pricesByMarket: [
        { market: "Mercado Econômico", price: 4.99 },
        { market: "SuperPreço", price: 5.49 },
      ],
      latestPrices,
      favoriteMarkets,
      monitoredProducts,
    } satisfies DashboardData;
  }
}

export async function getProdutos() { const { data } = await api.get<MonitoredProduct[]>("/produtos"); return data; }
export async function getMercados() { const { data } = await api.get<FavoriteMarket[]>("/mercados"); return data; }
export async function getPrecos() { const { data } = await api.get<PriceRecord[]>("/precos"); return data; }
