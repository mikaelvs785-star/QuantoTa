export type MarketStatus = "ACTIVE" | "INACTIVE";
export type MarketSort = "newest" | "oldest" | "az" | "za";

export interface Market {
  id: string;
  name: string;
  imageId?: string | null;
  phone: string;
  address?: string;
  neighborhood?: string;
  city: string;
  state: string;
  status: MarketStatus;
  ativo?: boolean;
}

export interface MarketInput {
  vendedorId?: string;
  name: string;
  imageId?: string | null;
  phone: string;
  address?: string;
  neighborhood?: string;
  city: string;
  state: string;
  status: MarketStatus;
}

export interface MarketListParams {
  page?: number;
  size?: number;
  search?: string;
  city?: string;
  state?: string;
  status?: MarketStatus | "ALL";
  sort?: MarketSort;
}

export interface MarketListResult {
  content: Market[];
  total: number;
}
