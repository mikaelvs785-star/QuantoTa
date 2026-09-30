export interface DashboardMetric {
  key: "products" | "markets" | "prices";
  label: string;
  value: number;
}
export interface PriceRecord {
  id: string;
  productId: string;
  marketId: string;
  product: string;
  market: string;
  price: number;
  date: string;
}
export interface DashboardData {
  metrics: DashboardMetric[];
  latestPrices: PriceRecord[];
}
