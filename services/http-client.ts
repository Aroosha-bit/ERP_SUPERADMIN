// "use client";

// import {
//   clearAccessToken,
//   getAccessToken,
//   setAccessToken,
// } from "@/lib/auth/token-store";
// import { refreshAccessToken } from "@/services/auth/auth-api";

// let refreshPromise: Promise<string> | null = null;

// async function refreshTokenOnce() {
//   if (!refreshPromise) {
//     refreshPromise = refreshAccessToken()
//       .then((response) => {
//         setAccessToken(response.accessToken);

//         return response.accessToken;
//       })
//       .catch((error) => {
//         clearAccessToken();

//         throw error;
//       })
//       .finally(() => {
//         refreshPromise = null;
//       });
//   }

//   return refreshPromise;
// }

// function buildHeaders(headers?: HeadersInit, token?: string | null) {
//   const result = new Headers(headers);

//   if (token) {
//     result.set("Authorization", `Bearer ${token}`);
//   }

//   return result;
// }

// export async function apiFetch(
//   input: RequestInfo | URL,
//   init: RequestInit = {},
// ): Promise<Response> {
//   const accessToken = getAccessToken();

//   const initialResponse = await fetch(input, {
//     ...init,
//     headers: buildHeaders(init.headers, accessToken),
//     credentials: "include",
//   });

//   if (initialResponse.status !== 401) {
//     return initialResponse;
//   }

//   try {
//     const newAccessToken = await refreshTokenOnce();

//     const retryResponse = await fetch(input, {
//       ...init,
//       headers: buildHeaders(init.headers, newAccessToken),
//       credentials: "include",
//     });

//     if (retryResponse.status === 401) {
//       clearAccessToken();
//     }

//     return retryResponse;
//   } catch {
//     clearAccessToken();

//     return initialResponse;
//   }
// }

import { clearSession, getAccessToken } from "@/lib/auth/token-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = getAccessToken();

  if (!token) {
    clearSession();
    throw new ApiError("Your session has expired. Please log in.", 401);
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const url = new URL(
    endpoint.replace(/^\//, ""),
    `${API_BASE_URL.replace(/\/$/, "")}/`,
  );

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Unable to connect to the server.", 0);
  }

  if (response.status === 401) {
    clearSession();
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }

  return response;
}

export async function apiJson<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await apiFetch(endpoint, options);

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new ApiError("Invalid response from the server.", response.status);
  }

  if (!response.ok) {
    const error = data as { errorMessage?: string; message?: string };

    throw new ApiError(
      error?.errorMessage || error?.message || "Request failed.",
      response.status,
    );
  }

  const result = data as {
    isError?: boolean;
    errorMessage?: string;
    message?: string;
  };

  if (result?.isError) {
    throw new ApiError(
      result.errorMessage || result.message || "Request failed.",
      response.status,
    );
  }

  return data as T;
}
