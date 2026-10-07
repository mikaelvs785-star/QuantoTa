import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./api";
import { AUTH_TOKEN_KEY, isTokenExpired, logout } from "./session";

function addAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && isTokenExpired(token)) {
    logout();
    config.headers.delete("Authorization");
    return config;
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else config.headers.delete("Authorization");
  return config;
}

function handleUnauthorized(error: AxiosError) {
  const config = error.config;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  // Uma resposta atrasada da sessão anterior não encerra um novo login.
  if (
    error.response?.status === 401 &&
    token &&
    config?.headers.get("Authorization") === `Bearer ${token}`
  ) {
    logout();
    // Consultas públicas continuam funcionando quando a API revoga a sessão.
    if (
      config.method === "get" &&
      /^\/(?:produtos(?:\/\d+)?|mercados(?:\/\d+)?|precos(?:\/atuais|\/produto\/\d+)?|vitrine(?:\/inicio)?|comparacoes\/embalagens\/\d+|permissoes|catalogo\/permissoes)$/.test(
        config.url?.split("?")[0] ?? "",
      )
    ) {
      config.headers.delete("Authorization");
      return api.request(config);
    }
  }
  return Promise.reject(error);
}

api.interceptors.request.use(addAuthorizationHeader);
api.interceptors.response.use((response) => response, handleUnauthorized);
