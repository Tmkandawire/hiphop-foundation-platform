import { createContext, useState, useContext, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with localStorage on initial mount
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  // ✅ login(token) function - Updated to sync isAuthenticated immediately
  const login = (newToken) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);

    toast.success("Welcome back, Admin!", {
      id: "admin-welcome",
      position: "top-center",
      duration: 3000,
    });
  };

  // ✅ logout() function
  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);

    toast.dismiss("admin-welcome");
    toast.success("Safe travels, Admin!", {
      icon: "👋",
      id: "logout-toast",
    });
  };

  // ✅ Memoized Value
  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      isLoading,
      isAuthenticated: !!token, // Computed boolean for easier protected routing
    }),
    [token, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render the app until we've checked localStorage */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
