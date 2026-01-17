import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedLayout() {
  const { status } = useAuth();

  /**
   * Não autenticado → login
   */
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  /**
   * Login ok, mas 2FA pendente → 2FA
   */
  if (status === "2fa_pending") {
    return <Navigate to="/2fa" replace />;
  }

  /**
   * Autenticado completo → libera layout
   */
  return <Outlet />;
}
