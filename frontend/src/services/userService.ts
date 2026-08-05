import { api } from "./api";
import type { User, UserInput } from "@/types/user";

function normalizeUsuario(usuario: any): User {
  return {
    id: String(usuario.id),
    name: usuario.nome ?? usuario.name,
    email: usuario.email,
    avatarUrl: usuario.avatarUrl,
    role: usuario.perfil,
    active: usuario.ativo,
  };
}

export const userService = {
  async listarUsuarios() {
    const { data } = await api.get<any[]>("/usuarios");
    return data.map(normalizeUsuario);
  },

  async cadastrarUsuario(input: UserInput) {
    const { data } = await api.post<any>("/usuarios", {
      nome: input.name,
      email: input.email,
      senha: input.password,
    });
    return normalizeUsuario(data);
  },
};
