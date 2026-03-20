import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  // 1. Wait for the AuthContext to finish checking localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 animate-pulse">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 2. If no token after loading is finished, redirect
  if (!token) {
    // We pass the current 'location' so the user returns here after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated - Render the dashboard content
  return children;
}
