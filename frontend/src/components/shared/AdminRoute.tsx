import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
