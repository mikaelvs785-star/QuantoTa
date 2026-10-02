export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  active?: boolean;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "VENDEDOR" | "ADMIN";
}
