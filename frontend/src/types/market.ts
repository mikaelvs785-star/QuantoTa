export type MarketStatus = "ACTIVE" | "INACTIVE";
export type MarketSort = "newest" | "oldest" | "az" | "za";

export interface Market {
  id: string;
  name: string;
  cnpj?: string;
  phone: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  cep?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  productCount: number;
  priceCount: number;
  status: MarketStatus;
  updatedAt: string;
  ativo?: boolean;
}

export interface MarketInput {
  name: string;
  cnpj?: string;
  phone: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  cep?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  latitude?: string;
  longitude?: string;
  description?: string;
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
