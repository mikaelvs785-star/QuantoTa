import { isAxiosError } from "axios";
import { api } from "./api";
import type { DashboardData, FavoriteMarket, MonitoredProduct, PriceRecord } from "@/types/dashboard";

export async function getDashboard() {
  try {
    const { data } = await api.get<DashboardData>("/dashboard");
    return data;
  } catch (error) {
    if (!isAxiosError(error) || error.response?.status !== 404) throw error;
    const [products, markets, prices] = await Promise.all([
      api.get<MonitoredProduct[]>("/produtos"),
      api.get<FavoriteMarket[]>("/mercados"),
      api.get<PriceRecord[]>("/precos"),
    ]);
    return { metrics: [], monthlySavings: [], popularProducts: [], pricesByMarket: [], latestPrices: prices.data, favoriteMarkets: markets.data, monitoredProducts: products.data };
  }
}

export async function getProdutos() { const { data } = await api.get<MonitoredProduct[]>("/produtos"); return data; }
export async function getMercados() { const { data } = await api.get<FavoriteMarket[]>("/mercados"); return data; }
export async function getPrecos() { const { data } = await api.get<PriceRecord[]>("/precos"); return data; }
