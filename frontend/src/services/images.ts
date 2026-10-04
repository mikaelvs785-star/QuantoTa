import { api } from "./api";
export function imageUrl(id?: string | null) {
  return id
    ? `${String(api.defaults.baseURL ?? "").replace(/\/$/, "")}/imagens/${encodeURIComponent(id)}`
    : undefined;
}
