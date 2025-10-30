"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type User = { email: string; name: string; role: "user" | "admin" } | null;

type AuthContextValue = {
  user: User;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "edu_portal_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // Load user from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(raw));
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  const persist = useCallback((u: User) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    const name = email.split("@")[0];
    // Check if admin credentials
    if (email === "admin@edu.mn" && password === "admin123") {
      persist({ email, name: "Админ", role: "admin" });
    } else {
      persist({ email, name, role: "user" });
    }
  }, [persist]);

  const register = useCallback(async (name: string, email: string) => {
    persist({ email, name, role: "user" });
  }, [persist]);

  const logout = useCallback(() => persist(null), [persist]);

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const value = useMemo(() => ({ user, login, register, logout, isAdmin }), [user, login, register, logout, isAdmin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


