import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),

  cnic: z
    .string()
    .min(13, "CNIC must contain 13 digits")
    .max(13, "CNIC must contain 13 digits")
    .regex(/^\d+$/, "CNIC must contain numbers only"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;