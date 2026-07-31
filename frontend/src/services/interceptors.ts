import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./api";
import { AUTH_TOKEN_KEY, logout } from "./auth";

function addAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}

function handleUnauthorized(error: AxiosError) {
  if (error.response?.status === 401) {
    logout();
    if (window.location.pathname !== "/login") window.location.assign("/login");
  }
  return Promise.reject(error);
}

api.interceptors.request.use(addAuthorizationHeader);
api.interceptors.response.use((response) => response, handleUnauthorized);
