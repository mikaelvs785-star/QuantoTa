import { test } from "node:test";
import assert from "node:assert/strict";
import {
  currentOffers,
  offersForProduct,
  moneyTotal,
} from "../src/lib/offers.ts";
const price = (
  id: string,
  productId: string,
  marketId: string,
  value: number,
  date = "2026-09-30",
) => ({
  id,
  productId,
  marketId,
  product: "Arroz",
  market: "Mercado",
  price: value,
  date,
});
test("latest price replaces historical cheapest price and IDs separate homonyms", () => {
  const prices = [
    price("1", "10", "20", 2, "2026-09-29"),
    price("2", "10", "20", 12),
    price("3", "11", "20", 1),
    price("4", "10", "21", 9),
  ];
  assert.deepEqual(
    offersForProduct(prices, "10").map((p) => p.price),
    [9, 12],
  );
  assert.equal(currentOffers(prices).length, 3);
});
test("same-date ties use most recent record ID", () => {
  assert.equal(
    currentOffers([price("9", "1", "2", 5), price("10", "1", "2", 8)])[0].price,
    8,
  );
});
test("zero, negative and invalid prices do not become free offers", () => {
  assert.deepEqual(
    currentOffers([
      price("1", "1", "2", 0),
      price("2", "1", "3", -1),
      price("3", "1", "4", NaN),
    ]),
    [],
  );
});
test("totals are summed in cents and missing prices leave a partial subtotal", () => {
  assert.equal(
    moneyTotal([
      { quantity: 3, unitPrice: 0.1 },
      { quantity: 1, unitPrice: 0.2 },
      { quantity: 2, unitPrice: null },
    ]),
    0.5,
  );
});
