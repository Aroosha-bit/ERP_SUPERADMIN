"use client";

import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  type LoginPayload,
} from "@/services/auth/auth-api";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
  });
}