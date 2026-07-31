import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading label="Verificando sessão..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
