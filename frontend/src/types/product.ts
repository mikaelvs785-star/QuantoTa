export type ProductStatus = "ACTIVE" | "INACTIVE";
export type ProductSort = "az" | "za";

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  brand?: string;
  unit?: string;
  imageUrl?: string;
  status: ProductStatus;
}

export interface ProductInput {
  name: string;
  category: string;
  description?: string;
  brand?: string;
  unit?: string;
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

export interface ProductListResult {
  content: Product[];
  total: number;
}
