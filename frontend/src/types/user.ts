export type UserRole = "ADMIN" | "USER" | "VENDEDOR";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  active?: boolean;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}