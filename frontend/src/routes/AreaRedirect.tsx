import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AreaRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.role === "ADMIN" ? "/admin/dashboard" : "/cliente/dashboard"} replace />;
}
