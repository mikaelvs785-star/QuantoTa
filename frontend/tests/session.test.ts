import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  SESSION_CHANGED,
  isTokenExpired,
  tokenExpiresAt,
  readSession,
  saveSession,
  logout,
} from "../src/services/session.ts";

const values = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  },
});
const events = new EventTarget();
Object.defineProperty(globalThis, "window", { value: events });
const jwt = (exp: unknown) =>
  `header.${btoa(JSON.stringify({ exp }))}.signature`;
const user = { id: "1", name: "Mikael", email: "mikael@test.local" };

test("rejects malformed, expired and nonnumeric token expirations", () => {
  for (const token of [
    "invalid",
    jwt(1),
    jwt("9999999999"),
    jwt(null),
    jwt(1e308),
  ]) {
    assert.equal(isTokenExpired(token), true);
  }
  assert.equal(isTokenExpired(jwt(Date.now() / 1_000 + 60)), false);
  assert.equal(tokenExpiresAt(jwt(123)), 123_000);
});

test("clears expired sessions and orphaned identities together", () => {
  values.set(AUTH_TOKEN_KEY, jwt(1));
  values.set(AUTH_USER_KEY, JSON.stringify(user));
  assert.deepEqual(readSession(), { token: null, user: null });
  assert.equal(values.size, 0);
  values.set(AUTH_USER_KEY, JSON.stringify(user));
  assert.deepEqual(readSession(), { token: null, user: null });
  assert.equal(values.size, 0);
});

test("malformed or incomplete stored identities cannot leave an authenticated session", () => {
  for (const storedUser of ["broken-json", "null", "{}"]) {
    values.set(AUTH_TOKEN_KEY, jwt(Date.now() / 1_000 + 60));
    values.set(AUTH_USER_KEY, storedUser);
    assert.deepEqual(readSession(), { token: null, user: null });
    assert.equal(values.size, 0);
  }
});

test("login and logout notify observers after updating both storage values", () => {
  const observed: ReturnType<typeof readSession>[] = [];
  const listener = () => observed.push(readSession());
  events.addEventListener(SESSION_CHANGED, listener);
  const token = jwt(Date.now() / 1_000 + 60);
  saveSession(token, user);
  logout();
  events.removeEventListener(SESSION_CHANGED, listener);
  assert.deepEqual(observed, [
    { token, user },
    { token: null, user: null },
  ]);
  assert.equal(values.size, 0);
});
