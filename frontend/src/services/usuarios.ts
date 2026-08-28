import { api } from "./api";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil?: string;
  ativo?: boolean;
}

export interface CadastroUsuario {
  nome: string;
  email: string;
  password: string;
  perfil?: string;
}

export async function getUsuarios(): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>("/usuarios");
  return data;
}

export async function getVendedores(): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>("/usuarios/vendedores");
  return data;
}

export async function cadastrarUsuario(
  usuario: CadastroUsuario
): Promise<Usuario> {
  const { data } = await api.post<Usuario>("/usuarios", usuario);
  return data;
}