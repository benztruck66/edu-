"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
} | null;

type AuthContextValue = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "edu_portal_token";
const USER_KEY = "edu_portal_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Load user from token after mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEY);
        if (token) {
          // Token-оор хэрэглэгчийн мэдээлэл авах
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          } else {
            // Token хүчингүй бол устгах
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const persist = useCallback((u: User, token?: string) => {
    setUser(u);
    if (u && token) {
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Нэвтрэхэд алдаа гарлаа");
    }

    persist(data.user, data.token);
  }, [persist]);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Бүртгүүлэхэд алдаа гарлаа");
    }

    persist(data.user, data.token);
  }, [persist]);

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  const isAdmin = useMemo(() => {
    return user?.role === "SUPER_ADMIN" || user?.role === "UNIVERSITY_ADMIN";
  }, [user]);

  const value = useMemo(
    () => ({ user, login, register, logout, isAdmin, loading }),
    [user, login, register, logout, isAdmin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


