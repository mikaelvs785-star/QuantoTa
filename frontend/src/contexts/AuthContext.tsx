import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { login as loginRequest } from "@/services/auth";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  SESSION_CHANGED,
  readSession,
  saveSession,
  tokenExpiresAt,
  logout as clearSession,
} from "@/services/session";
import type { AuthContextType, LoginRequest } from "@/types/auth";
import type { User } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [{ token, user }, setSession] = useState(readSession);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const synchronize = () => {
      queryClient.clear();
      setSession(readSession());
    };
    const onStorage = (event: StorageEvent) => {
      if (
        event.storageArea === localStorage &&
        (event.key === null ||
          event.key === AUTH_TOKEN_KEY ||
          event.key === AUTH_USER_KEY)
      ) {
        synchronize();
      }
    };
    window.addEventListener(SESSION_CHANGED, synchronize);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SESSION_CHANGED, synchronize);
      window.removeEventListener("storage", onStorage);
    };
  }, [queryClient]);

  useEffect(() => {
    if (!token) return;
    // Reagenda sessões longas para respeitar o limite do temporizador do navegador.
    const checkExpiration = () => {
      window.clearTimeout(timer);
      const remaining = tokenExpiresAt(token) - Date.now();
      if (remaining <= 0) clearSession();
      else
        timer = window.setTimeout(
          checkExpiration,
          Math.min(remaining, 2_147_483_647),
        );
    };
    let timer: number;
    checkExpiration();
    window.addEventListener("focus", checkExpiration);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", checkExpiration);
    };
  }, [token]);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await loginRequest(credentials);

      const normalizedUser: User = response.usuario ?? {
        id: String(response.id ?? ""),
        name: response.nome ?? response.email ?? credentials.email,
        email: response.email ?? credentials.email,
        role: response.perfil ?? "USER",
        active: response.ativo ?? true,
      };

      if (!response.token?.trim())
        throw new Error("A resposta de login não possui uma sessão válida.");
      const normalizedToken = response.token.trim();

      saveSession(normalizedToken, normalizedUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token, loading, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
