import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role check (if role is provided)
  if (role && user.role !== role) {
    return <h1>Access Denied</h1>;
  }

  return children;
}

export default ProtectedRoute;