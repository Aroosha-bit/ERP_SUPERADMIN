import { useMutation } from "@tanstack/react-query";
import type { LoginFormValues } from "@/lib/validations/auth.schema";

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      // MOCK TEMPORARILY

      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        user: {
          id: "1",
          name: "Super Admin",
          role: "SUPER_ADMIN",
        },
      };
    },
  });
}