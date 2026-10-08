import type {
  AuthUser,
  LoginResponse,
  RefreshResponse,
} from "@/lib/auth/auth-types";

export type LoginPayload = {
  email: string;
  cnic: string;
  password: string;
};

type LogoutResponse = {
  success: boolean;
  message: string;
};

type MeResponse = {
  success: boolean;
  user: AuthUser;
};

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error(fallbackMessage);
  }

  if (!response.ok) {
    const errorData = data as {
      message?: string;
    };

    throw new Error(errorData.message || fallbackMessage);
  }

  return data as T;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseResponse<LoginResponse>(response, "Login failed.");
}

export async function refreshAccessToken(): Promise<RefreshResponse> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });

  return parseResponse<RefreshResponse>(response, "Your session has expired.");
}

export async function logoutUser(): Promise<LogoutResponse> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  return parseResponse<LogoutResponse>(response, "Logout failed.");
}

export async function getCurrentUser(accessToken: string): Promise<MeResponse> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  return parseResponse<MeResponse>(response, "Unable to load user.");
}
