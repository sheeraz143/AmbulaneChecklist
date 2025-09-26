import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  role: "admin" | "user";
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const adminAuth = localStorage.getItem("adminAuth") === "true";
  const userAuth = localStorage.getItem("userAuth") === "true";

  if (role === "admin" && !adminAuth) return <Navigate to="/admin-login" replace />;
  if (role === "user" && !userAuth) return <Navigate to="/" replace />;

  return <Outlet />;
}
