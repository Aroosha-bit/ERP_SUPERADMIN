import Cookies from "js-cookie";
import type { AuthSession } from "./auth-types";

export const AUTH_STORAGE_KEY = "erp_auth_session";
export const AUTH_CHANGED_EVENT = "erp-auth-changed";

export function isSessionValid(
  session: AuthSession | null,
): session is AuthSession {
  if (!session?.token || !session?.expiresOn || !session?.user) {
    return false;
  }

  const expiry = Date.parse(session.expiresOn);

  return Number.isFinite(expiry) && expiry > Date.now();
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const stored = Cookies.get(AUTH_STORAGE_KEY);

  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as AuthSession;

    if (!isSessionValid(session)) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;

  if (!isSessionValid(session)) {
    throw new Error("Cannot save an invalid or expired session.");
  }

  Cookies.set(AUTH_STORAGE_KEY, JSON.stringify(session), {
    expires: new Date(session.expiresOn),
    path: "/",
    sameSite: "Lax",
    secure: window.location.protocol === "https:",
  });

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  Cookies.remove(AUTH_STORAGE_KEY, { path: "/" });

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function getAccessToken(): string | null {
  return getStoredSession()?.token ?? null;
}
