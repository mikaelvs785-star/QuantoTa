import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, getStoredUser, login as loginRequest, logout as clearSession } from "@/services/auth";
import type { AuthContextType, LoginRequest } from "@/types/auth";
import type { User } from "@/types/user";
import { AuthContext } from "./authContextValue";
import { normalizeUserRole } from "@/config/navigation";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await loginRequest(credentials);

      const loginUser = response.usuario;
      const normalizedUser: User = {
        id: String(loginUser?.id ?? response.id ?? ""),
        name: loginUser?.name ?? response.nome ?? response.email ?? credentials.email,
        email: loginUser?.email ?? response.email ?? credentials.email,
        role: normalizeUserRole(loginUser?.role ?? response.perfil),
        active: loginUser?.active ?? response.ativo ?? true,
      };

      if (!response.token?.trim()) throw new Error("A resposta de login não possui uma sessão válida.");
      const normalizedToken = response.token.trim();

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
