import axios from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
if (!baseURL) console.warn("Configure EXPO_PUBLIC_API_URL no ambiente mobile.");

export const api = axios.create({ baseURL, timeout: 15_000, headers: { Accept: "application/json" } });

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync("quantota.accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(response => response, async error => {
  if (error.response?.status === 401) await SecureStore.deleteItemAsync("quantota.accessToken");
  return Promise.reject(error);
});