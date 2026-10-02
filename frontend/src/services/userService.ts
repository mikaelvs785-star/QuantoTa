import { api } from "./api";
import type { User, UserInput } from "@/types/user";
type BackendUser = {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
};
function normalizeUsuario(user: BackendUser): User {
  return {
    id: String(user.id),
    name: user.nome,
    email: user.email,
    role: user.perfil,
    active: user.ativo,
  };
}
export const userService = {
  async me() {
    return normalizeUsuario((await api.get<BackendUser>("/auth/profile")).data);
  },
  async listarVendedores() {
    return (await api.get<BackendUser[]>("/usuarios/vendedores")).data.map(
      normalizeUsuario,
    );
  },
  async listarUsuarios() {
    const { data } = await api.get<BackendUser[]>("/usuarios");
    return data.map(normalizeUsuario);
  },
  async cadastrarUsuario(input: UserInput) {
    const { data } = await api.post<BackendUser>("/usuarios", {
      nome: input.name,
      email: input.email,
      senha: input.password,
      perfil: input.role,
    });
    return normalizeUsuario(data);
  },
};
