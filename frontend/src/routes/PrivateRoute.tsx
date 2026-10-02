import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading label="Verificando sessão..." />;
  if (!isAuthenticated)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search + location.hash }}
        replace
      />
    );
  return children;
}
