export interface DashboardMetric {
  key:
    | "products"
    | "markets"
    | "prices"
    | "users"
    | "lists"
    | "savings"
    | "monitored";

  label: string;

  value: number;

  variation: number;
}

export interface MonthlySavings { month: string; value: number; }
export interface SearchedProduct { name: string; searches: number; }
export interface MarketPrice { market: string; price: number; }

export interface PriceRecord {
  id: string;
  product: string;
  market: string;
  price: number;
  date: string;
}

export interface FavoriteMarket {
  id: string;
  name: string;
  productCount: number;
  bestPrice: number;
  distance?: number;
}

export interface MonitoredProduct {
  id: string;
  name: string;
  imageUrl?: string;
  lowestPrice: number;
  highestPrice: number;
  savings: number;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  monthlySavings: MonthlySavings[];
  popularProducts: SearchedProduct[];
  pricesByMarket: MarketPrice[];
  latestPrices: PriceRecord[];
  favoriteMarkets: FavoriteMarket[];
  monitoredProducts: MonitoredProduct[];
}
