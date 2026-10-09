"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import type { AuthSession, AuthUser } from "@/lib/auth/auth-types";
import {
  clearSession,
  getStoredSession,
  isSessionValid,
  saveSession,
} from "@/lib/auth/token-store";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  establishSession: (session: AuthSession) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const establishSession = useCallback((newSession: AuthSession) => {
    if (!isSessionValid(newSession)) {
      throw new Error("Cannot establish an expired session.");
    }

    saveSession(newSession);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    const syncSession = () => {
      const storedSession = getStoredSession();

      setSession(storedSession);
      setIsAuthLoading(false);
    };

    syncSession();

    window.addEventListener("erp-auth-changed", syncSession);
    window.addEventListener("focus", syncSession);

    return () => {
      window.removeEventListener("erp-auth-changed", syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    const expiry = Date.parse(session.expiresOn);
    const remaining = expiry - Date.now();

    if (remaining <= 0) {
      clearSession();
      setSession(null);
      return;
    }

    const timer = window.setTimeout(
      () => {
        clearSession();
        setSession(null);
      },
      Math.min(remaining, 2147483647),
    );

    return () => window.clearTimeout(timer);
  }, [session]);

  useEffect(() => {
    if (!isAuthLoading && !session && window.location.pathname !== "/login") {
      // AuthGuard handles protected-page redirection.
    }
  }, [isAuthLoading, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: isSessionValid(session),
      isAuthLoading,
      establishSession,
      logout,
      hasPermission: (permission) =>
        session?.user.permissions.includes(permission) ?? false,
      hasRole: (role) => session?.user.roles.includes(role) ?? false,
    }),
    [session, isAuthLoading, establishSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
