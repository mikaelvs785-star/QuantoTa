import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, getStoredUser, login as loginRequest, logout as clearSession } from "@/services/auth";
import type { AuthContextType, LoginRequest } from "@/types/auth";
import type { User } from "@/types/user";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await loginRequest(credentials);

      const normalizedUser: User = response.usuario ?? {
        id: String(response.id ?? ""),
        name: response.nome ?? response.email ?? credentials.email,
        email: response.email ?? credentials.email,
      };

      const normalizedToken = response.token?.trim() || `quantota-session-${normalizedUser.id || normalizedUser.email}`;

      localStorage.setItem(AUTH_TOKEN_KEY, normalizedToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizedUser));
      setToken(normalizedToken);
      setUser(normalizedUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(() => ({ user, token, loading, isAuthenticated: Boolean(token), login, logout }), [user, token, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
