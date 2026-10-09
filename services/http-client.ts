
"use client";

import { clearSession, getAccessToken } from "@/lib/auth/token-store";
import { API_MODE, getApiUrl } from "@/lib/config/api";

type RuntimeSchema<T> = {
  parse: (value: unknown) => T;
};

function buildHeaders(
  headers?: HeadersInit,
  token?: string | null,
): Headers {
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

  clearSession();
  return initialResponse;
}

// Use the correct API transport for mock or backend mode.
async function sendRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = getApiUrl(path);

  if (API_MODE === "backend") {
    return apiFetch(url, init);
  }

  return fetch(url, {
    ...init,
    cache: "no-store",
  });
}

// Extract a useful message from failed HTTP responses.
async function getErrorMessage(
  response: Response,
): Promise<string> {
  let body: unknown;

  try {
    body = await response.json();
  } catch {
    return `Request failed with status ${response.status}.`;
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "errorMessage" in body &&
    typeof body.errorMessage === "string"
  ) {
    return body.errorMessage;
  }

  return `Request failed with status ${response.status}.`;
}

// Send a request and validate its JSON response.
export async function apiRequest<T>(
  path: string,
  schema: RuntimeSchema<T>,
  init: RequestInit = {},
): Promise<T> {
  const response = await sendRequest(path, init);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new Error("The API returned an invalid JSON response.");
  }

  return schema.parse(body);
}

// Prepare JSON request bodies consistently.
export function jsonRequest(
  method: "POST" | "PUT" | "PATCH",
  body: unknown,
): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

// DELETE may return an empty response, so don't parse JSON.
export async function apiDelete(
  path: string,
): Promise<void> {
  const response = await sendRequest(path, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}