"use client";

import type { AuthUser } from "@/lib/auth/auth-types";
import { apiFetch } from "@/services/http-client";

type MeResponse = {
  success: boolean;
  user: AuthUser;
};

export async function fetchProtectedUser() {
  const response = await apiFetch("/api/auth/me", {
    method: "GET",
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok) {
    const errorData = data as {
      message?: string;
    };

    throw new Error(errorData.message || "Protected request failed.");
  }

  return data as MeResponse;
}
