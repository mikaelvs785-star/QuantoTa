import { api } from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import type { User } from "@/types/user";

export const AUTH_TOKEN_KEY = "quantota-token";
export const AUTH_USER_KEY = "quantota-user";

export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;

    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(decodedPayload) as { exp?: number };
    return typeof exp !== "number" || exp * 1_000 <= Date.now();
  } catch {
    return true;
  }
}

export async function login(credentials: LoginRequest) {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email: credentials.email,
    senha: credentials.password,
  });
  return data;
}

export async function registerUser(payload: RegisterRequest) {
  const { data } = await api.post<{ id: number; nome: string; email: string; senha: string }>("/usuarios", {
    nome: payload.nome,
    email: payload.email,
    senha: payload.password,
  });
  return data;
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export async function getProfile() {
  const { data } = await api.get<User>("/auth/profile");
  return data;
}

export function getStoredUser(): User | null {
  const user = localStorage.getItem(AUTH_USER_KEY);
  if (!user) return null;
  try {
    const storedUser = JSON.parse(user) as User;
    // Sessões criadas antes da separação de áreas não tinham perfil.
    // Elas pertencem à área do cliente até que o usuário faça login novamente.
    return { ...storedUser, role: storedUser.role ?? "USER" };
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}
