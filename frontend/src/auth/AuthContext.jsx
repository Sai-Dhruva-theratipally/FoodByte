import React, { createContext, useContext, useMemo, useState } from "react";
import { clearAuth, loadAuth, saveAuth } from "./authStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth());

  const value = useMemo(() => {
    const token = auth?.token || null;
    const user = auth
      ? {
          userId: auth.userId,
          email: auth.email,
          name: auth.name,
          role: auth.role,
        }
      : null;

    return {
      token,
      user,
      isAuthenticated: Boolean(token),
      setAuth: (nextAuth) => {
        setAuth(nextAuth);
        saveAuth(nextAuth);
      },
      logout: () => {
        setAuth(null);
        clearAuth();
      },
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
