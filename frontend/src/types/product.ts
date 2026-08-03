export type ProductStatus = "ACTIVE" | "INACTIVE";
export type ProductSort = "newest" | "oldest" | "az" | "za";

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  barcode?: string;
  imageUrl?: string;
  status: ProductStatus;
  priceCount: number;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  category: string;
  description?: string;
  barcode?: string;
  imageUrl?: string;
  status: ProductStatus;
}

export interface ProductListParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  status?: ProductStatus | "ALL";
  sort?: ProductSort;
}

export interface ProductListResult { content: Product[]; total: number; }
