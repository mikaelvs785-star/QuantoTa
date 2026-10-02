import { api } from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types/auth";

export async function login(credentials: LoginRequest) {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email: credentials.email.trim().toLowerCase(),
    senha: credentials.password,
  });
  return data;
}

export async function registerUser(payload: RegisterRequest) {
  const { data } = await api.post<{
    id: number;
    nome: string;
    email: string;
  }>("/auth/register", {
    nome: payload.nome,
    email: payload.email,
    senha: payload.password,
  });
  return data;
}
