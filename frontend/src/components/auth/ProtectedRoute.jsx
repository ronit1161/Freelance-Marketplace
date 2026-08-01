import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated } = useAuth();
  const token = localStorage.getItem("jwt_token") || localStorage.getItem("token");

  // Check JWT token & logged-in status
  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role || "").toUpperCase();

  // If specific roles are required, check role authorization
  if (allowedRoles.length > 0) {
    const formattedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());
    const isRoleAuthorized = formattedAllowedRoles.includes(userRole);

    if (!isRoleAuthorized) {
      // Redirect unauthorized users to their respective role dashboards
      if (userRole === "CLIENT") {
        return <Navigate to="/client" replace />;
      } else if (userRole === "FREELANCER") {
        return <Navigate to="/freelancer" replace />;
      } else if (userRole === "ADMIN") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children ? children : <Outlet />;
}
