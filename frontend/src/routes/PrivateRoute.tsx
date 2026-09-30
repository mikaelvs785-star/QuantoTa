import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";

export function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <Loading label="Verificando sessão..." />;
  if (!isAuthenticated)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search + location.hash }}
        replace
      />
    );
  if (!user?.role)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search + location.hash }}
        replace
      />
    );
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={"/dashboard"} replace />;
  }
  return children;
}
