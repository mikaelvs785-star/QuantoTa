import { api } from "./api";
import type { PriceRecord } from "@/types/dashboard";

type BackendProduct = {
  id: number;
  nome: string;
  categoria?: string;
  descricao?: string;
  marca?: string;
  unidadeMedida?: string;
  quantidadeBase?: number;
  ativo?: boolean;
};
type BackendMarket = { id: number; nome: string; ativo?: boolean };
export type BackendPrice = {
  id: number;
  produto: BackendProduct;
  mercado: BackendMarket;
  valor: number;
  dataColeta: string;
  imagemId?: string;
  precoPorMedida?: number;
  unidadeBase?: string;
};

export async function getPrecos(current = false): Promise<PriceRecord[]> {
  const { data } = await api.get<BackendPrice[]>(
    current ? "/precos/atuais" : "/precos",
  );
  return data.map(normalizePrice);
}
export function normalizePrice(p: BackendPrice): PriceRecord {
  return {
    id: String(p.id), productId: String(p.produto.id), marketId: String(p.mercado.id),
    product: p.produto.nome, market: p.mercado.nome, price: Number(p.valor), date: p.dataColeta,
    imageId: p.imagemId, brand: p.produto.marca, unit: p.produto.unidadeMedida, category:p.produto.categoria,
    unitPrice: p.precoPorMedida, baseUnit: p.unidadeBase, baseQuantity:p.produto.quantidadeBase,
  };
}
