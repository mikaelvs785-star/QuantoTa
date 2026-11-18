import * as SecureStore from "expo-secure-store";
import { api } from "./api";

export type AuthResult = { token?: string; accessToken?: string; jwt?: string; [key: string]: unknown };

export async function login(email: string, senha: string) {
  const { data } = await api.post<AuthResult>("/auth/login", { email, senha });
  const token = data.token ?? data.accessToken ?? data.jwt;
  if (!token) throw new Error("A resposta de login não contém um token reconhecido. Ajustar ao DTO real da API.");
  await SecureStore.setItemAsync("quantota.accessToken", token);
  return data;
}

export async function logout() {
  await SecureStore.deleteItemAsync("quantota.accessToken");
}

export async function restoreToken() {
  return SecureStore.getItemAsync("quantota.accessToken");
}

export async function getProfile() {
  const { data } = await api.get("/auth/profile");
  return data;
}