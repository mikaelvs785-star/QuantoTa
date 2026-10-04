export interface PriceRecord {
  id: string;
  productId: string;
  marketId: string;
  product: string;
  market: string;
  price: number;
  date: string;
  imageId?: string | null;
  brand?: string;
  unit?: string;
  category?: string;
  unitPrice?: number | null;
  baseUnit?: string | null;
  baseQuantity?: number | null;
}
