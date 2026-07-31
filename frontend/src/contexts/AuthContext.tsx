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
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.usuario));
      setToken(response.token);
      setUser(response.usuario);
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
