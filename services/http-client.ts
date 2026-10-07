"use client";

import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth/token-store";
import { refreshAccessToken } from "@/services/auth/auth-api";

let refreshPromise: Promise<string> | null = null;

async function refreshTokenOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .then((response) => {
        setAccessToken(response.accessToken);

        return response.accessToken;
      })
      .catch((error) => {
        clearAccessToken();

        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function buildHeaders(headers?: HeadersInit, token?: string | null) {
  const result = new Headers(headers);

  if (token) {
    result.set("Authorization", `Bearer ${token}`);
  }

  return result;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const accessToken = getAccessToken();

  const initialResponse = await fetch(input, {
    ...init,
    headers: buildHeaders(init.headers, accessToken),
    credentials: "include",
  });

  if (initialResponse.status !== 401) {
    return initialResponse;
  }

  try {
    const newAccessToken = await refreshTokenOnce();

    const retryResponse = await fetch(input, {
      ...init,
      headers: buildHeaders(init.headers, newAccessToken),
      credentials: "include",
    });

    if (retryResponse.status === 401) {
      clearAccessToken();
    }

    return retryResponse;
  } catch {
    clearAccessToken();

    return initialResponse;
  }
}
