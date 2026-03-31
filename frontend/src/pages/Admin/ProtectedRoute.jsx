import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  /* -------------------------
     LOADING STATE
     Wait for silent refresh to
     complete before deciding
     whether to redirect or not.
     Without this, the admin gets
     redirected to login on every
     page refresh even with a
     valid refresh token cookie.
  ------------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FB] gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#145CF3] flex items-center justify-center text-white font-black text-sm animate-pulse">
          HHF
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
          Authenticating...
        </p>
      </div>
    );
  }

  /* -------------------------
     NOT AUTHENTICATED
     Redirect to login and
     remember where they were
     trying to go
  ------------------------- */
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  /* -------------------------
     AUTHENTICATED
     Render protected content
  ------------------------- */
  return children;
}
