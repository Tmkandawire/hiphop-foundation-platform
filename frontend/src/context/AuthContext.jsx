import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* -------------------------
     SILENT REFRESH ON MOUNT
     When the app loads, try to
     get a new access token using
     the httpOnly refresh cookie
     from a previous session
  ------------------------- */

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true) return;

    const silentRefresh = async () => {
      const hasSessionHint = localStorage.getItem("access_token");

      if (!hasSessionHint) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/admin/refresh");
        if (res.data.accessToken) {
          setAccessToken(res.data.accessToken);
          localStorage.setItem("access_token", res.data.accessToken);
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Refresh logic error:", err.message);
        }
        setAccessToken(null);
        localStorage.removeItem("access_token");
      } finally {
        setIsLoading(false);
      }
    };

    silentRefresh();

    return () => {
      effectRan.current = true;
    };
  }, []);

  /* -------------------------
     LOGIN
     Called after successful
     login API response
  ------------------------- */
  const login = useCallback((newAccessToken) => {
    setAccessToken(newAccessToken);
    localStorage.setItem("access_token", newAccessToken);

    toast.success("Welcome back, Admin!", {
      id: "admin-welcome",
      position: "top-center",
      duration: 3000,
    });
  }, []);

  /* -------------------------
     LOGOUT
     logoutAll = true revokes
     all devices, false revokes
     only the current device
  ------------------------- */
  const logout = useCallback(async (logoutAll = false) => {
    try {
      // Tell backend to revoke the refresh token in DB
      await axiosInstance.post(
        logoutAll ? "/admin/logout-all" : "/admin/logout",
      );
    } catch (err) {
      // Even if the API call fails, clear frontend state
      console.error("Logout API error:", err.message);
    } finally {
      setAccessToken(null);
      localStorage.removeItem("access_token");

      toast.dismiss("admin-welcome");
      toast.success(
        logoutAll ? "Logged out from all devices." : "Safe travels, Admin!",
        { icon: "👋", id: "logout-toast" },
      );
    }
  }, []);

  /* -------------------------
     MEMOIZED CONTEXT VALUE
     Prevents unnecessary
     re-renders across the tree
  ------------------------- */
  const value = useMemo(
    () => ({
      token: accessToken,
      login,
      logout,
      isLoading,
      isAuthenticated: !!accessToken,
    }),
    [accessToken, login, logout, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {/* Block render until silent refresh completes
          so ProtectedRoute has correct auth state */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

/* -------------------------
   useAuth HOOK
   Exported here so there's
   no need for a separate
   useAuth.js file
------------------------- */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
