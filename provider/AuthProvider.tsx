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

import type { AuthUser } from "@/lib/auth/auth-types";
import {
  clearAccessToken,
  setAccessToken,
  subscribeToAccessToken,
} from "@/lib/auth/token-store";
import {
  logoutUser,
  refreshAccessToken,
} from "@/services/auth/auth-api";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  establishSession: (
    accessToken: string,
    user: AuthUser
  ) => void;
  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [hasAccessToken, setHasAccessToken] =
    useState(false);

  const [isAuthLoading, setIsAuthLoading] =
    useState(true);

  const establishSession = useCallback(
    (
      accessToken: string,
      authenticatedUser: AuthUser
    ) => {
      setAccessToken(accessToken);
      setUser(authenticatedUser);
      setHasAccessToken(true);
    },
    []
  );

  const clearSession = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setHasAccessToken(false);
  }, []);

  useEffect(() => {
    return subscribeToAccessToken((token) => {
      setHasAccessToken(Boolean(token));

      if (!token) {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const response =
          await refreshAccessToken();

        if (cancelled) {
          return;
        }

        establishSession(
          response.accessToken,
          response.user
        );
      } catch {
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setIsAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [clearSession, establishSession]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearSession();
      router.replace("/login");
      router.refresh();
    }
  }, [clearSession, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated:
        Boolean(user) && hasAccessToken,
      isAuthLoading,
      establishSession,
      logout,
    }),
    [
      user,
      hasAccessToken,
      isAuthLoading,
      establishSession,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}