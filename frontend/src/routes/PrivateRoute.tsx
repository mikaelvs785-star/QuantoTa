import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";

export function PrivateRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <Loading label="Verificando sessão..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to={user?.role === "ADMIN" ? "/admin/dashboard" : "/cliente/dashboard"} replace />;
  }
  return children;
}
