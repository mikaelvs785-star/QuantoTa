import type { User } from "../types/user";

export const AUTH_TOKEN_KEY = "quantota-token";
export const AUTH_USER_KEY = "quantota-user";
export const SESSION_CHANGED = "quantota-session-changed";

export function tokenExpiresAt(token: string): number {
  try {
    const payload = token.split(".")[1];
    const { exp } = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    const expiresAt = typeof exp === "number" ? exp * 1_000 : 0;
    return Number.isFinite(expiresAt) ? expiresAt : 0;
  } catch {
    return 0;
  }
}

export function isTokenExpired(token: string): boolean {
  return tokenExpiresAt(token) <= Date.now();
}

export function readSession(): { token: string | null; user: User | null } {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && !isTokenExpired(token)) {
    try {
      const user = JSON.parse(
        localStorage.getItem(AUTH_USER_KEY) ?? "null",
      ) as User | null;
      if (user?.id && user.name && user.email) return { token, user };
    } catch {
      // Uma sessão incompleta precisa de um novo login.
    }
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  return { token: null, user: null };
}

export function saveSession(token: string, user: User) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_CHANGED));
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGED));
}
