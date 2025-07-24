// src/Components/Common/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;