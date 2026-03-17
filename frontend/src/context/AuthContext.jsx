import { createContext, useState } from "react";

export const AuthContext = createContext(null);

/*
  Auth Provider (Component ONLY)
*/
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("auth_token");
  });

  const login = (newToken) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
