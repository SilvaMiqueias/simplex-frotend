import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function TwoFactorRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { status } = useAuth();

  if (status === "2fa_required" ||
      status === "2fa_setup") {
    return children;
  }

  return <Navigate to="/login" replace />;
}