"use client";

import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/provider/AuthProvider";
import { loginUser, type LoginPayload } from "@/services/auth/auth-api";

export function useLogin() {
  const { establishSession } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),

    onSuccess: (response) => {
      establishSession(response.accessToken, response.user);
    },
  });
}
