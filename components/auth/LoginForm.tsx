"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useLogin } from "@/hooks/auth/useLogin";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth.schema";
import { useAuth } from "@/provider/AuthProvider";

export default function LoginForm() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      cnic: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  async function onSubmit(values: LoginFormValues) {
    try {
      await loginMutation.mutateAsync(values);
      router.replace("/dashboard");
    } catch {
      // API error is displayed using loginMutation.error.
    }
  }

  const isLoading = isSubmitting || loginMutation.isPending;

  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="w-full max-w-[440px] rounded-[16px] bg-[#F7F7F7] px-5 py-10 text-center sm:px-8 md:px-10">
        <p className="text-sm text-[#001033]">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] rounded-[16px] bg-[#F7F7F7] px-5 py-7 sm:px-8 sm:py-8 md:px-10 md:py-10">
      <div className="text-center">
        <h1 className="text-[20px] font-semibold leading-[120%] tracking-[0px] text-[#001033] sm:text-[22px] md:text-[24px]">
          Let&apos;s Get Started
        </h1>

        <p className="mt-4 text-[12px] font-semibold text-[#001033] sm:mt-5 sm:text-[13px]">
          Sign In to Continue
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 sm:mt-8"
        noValidate
      >
        <FieldGroup className="gap-3 sm:gap-4">
          {/* Email */}
          <Field data-invalid={!!errors.email}>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              aria-invalid={!!errors.email}
              className="h-9 w-full text-xs sm:h-10 sm:text-sm"
              disabled={isLoading}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

          {/* CNIC */}
          <Field data-invalid={!!errors.cnic}>
            <Input
              {...register("cnic")}
              inputMode="numeric"
              placeholder="CNIC Number"
              maxLength={13}
              aria-invalid={!!errors.cnic}
              className="h-9 w-full text-xs sm:h-10 sm:text-sm"
              disabled={isLoading}
            />
            {errors.cnic && <FieldError errors={[errors.cnic]} />}
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <Input
              {...register("password")}
              type="password" 
              placeholder="Password"
              aria-invalid={!!errors.password}
              className="h-9 w-full text-xs sm:h-10 sm:text-sm"
              disabled={isLoading}
            />
            {errors.password && <FieldError errors={[errors.password]} />}
          </Field>
        </FieldGroup>

        {/* API Error */}
        {loginMutation.isError && (
          <p role="alert" className="mt-3 text-center text-xs text-red-500">
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : "Unable to sign in. Please try again."}
          </p>
        )}

        {/* Links */}
        <div className="mt-3 flex items-center justify-between gap-4 text-[10px] sm:text-xs">
          <Link
            href="/forgot-password"
            className="text-[#3BA6DB] hover:underline"
          >
            Forgot Password?
          </Link>

          <Link href="/register" className="text-[#3BA6DB] hover:underline">
            Register
          </Link>
        </div>

        {/* Submit Button */}
        <div className="mt-5 flex justify-center sm:mt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-9 rounded-md bg-auth-background px-5 text-xs text-white hover:bg-[#001033]/90"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}
