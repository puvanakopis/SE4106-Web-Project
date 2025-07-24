// src/Components/Common/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = ['user'] }) => {
  const { isLoggedIn, isAdmin, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = allowedRoles.includes('admin') && isAdmin || 
                        allowedRoles.includes('user') && !isAdmin;

  if (!hasAllowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;