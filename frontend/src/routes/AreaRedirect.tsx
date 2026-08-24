import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getDefaultRouteByRole } from "@/config/navigation";

export function AreaRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={getDefaultRouteByRole(user.role)}
      replace
    />
  );
}