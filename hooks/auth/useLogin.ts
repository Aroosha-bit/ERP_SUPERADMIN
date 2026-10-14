"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/provider/AuthProvider";
import { loginUser } from "@/services/auth/auth-api";
import type { LoginPayload } from "@/lib/auth/auth-types";

export function useLogin() {
  const { establishSession } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (session) => {
      establishSession(session);
    },
  });
}
