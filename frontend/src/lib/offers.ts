import type { PriceRecord } from "../types/dashboard";

/** Latest collected price per product/market. IDs keep homonymous products apart. */
export function currentOffers(prices: PriceRecord[]): PriceRecord[] {
  const latest = new Map<string, PriceRecord>();
  for (const price of prices) {
    if (
      !price.productId ||
      !price.marketId ||
      !Number.isFinite(price.price) ||
      price.price <= 0
    )
      continue;
    const key = `${price.productId}:${price.marketId}`;
    const previous = latest.get(key);
    if (
      !previous ||
      price.date > previous.date ||
      (price.date === previous.date && Number(price.id) > Number(previous.id))
    )
      latest.set(key, price);
  }
  return [...latest.values()];
}
export function offersForProduct(prices: PriceRecord[], productId: string) {
  return currentOffers(prices)
    .filter((price) => price.productId === productId)
    .sort((a, b) => a.price - b.price);
}
export function moneyTotal(
  items: { quantity: number; unitPrice: number | null }[],
) {
  return (
    items.reduce(
      (total, item) =>
        total + Math.round((item.unitPrice ?? 0) * 100) * item.quantity,
      0,
    ) / 100
  );
}
export function displayDate(value: string) {
  if (!value) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(`${value.slice(0, 10)}T12:00:00`),
  );
}
