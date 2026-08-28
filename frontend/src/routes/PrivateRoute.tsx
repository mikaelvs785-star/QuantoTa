import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultRouteByRole, normalizeUserRole } from "@/config/navigation";

export function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loading label="Verificando sessão..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = normalizeUserRole(user?.role);

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  const normalizedAllowedRoles = allowedRoles
    ?.map(normalizeUserRole)
    .filter((role): role is NonNullable<typeof role> => Boolean(role));

  if (
    normalizedAllowedRoles &&
    !normalizedAllowedRoles.includes(userRole)
  ) {
    return (
      <Navigate
        to={getDefaultRouteByRole(userRole)}
        replace
      />
    );
  }

  return children;
}
