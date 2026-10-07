"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";

import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth.schema";
import { useLogin } from "@/hooks/auth/useLogin";


export default function LoginForm() {
  const router = useRouter();

  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      cnic: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  }

  return (
    <div className="w-full max-w-[440px] rounded-[16px] bg-[#F7F7F7] px-5 py-7 sm:px-8 sm:py-8 md:px-10 md:py-10">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-[20px] font-semibold leading-[120%] tracking-[0px] text-[#001033] sm:text-[22px] md:text-[24px]">
          Let&apos;s Get Started
        </h1>

        <p className="mt-4 text-[12px] font-semibold text-[#001033] sm:mt-5 sm:text-[13px]">
          Sign In to Continue
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 sm:mt-8"
      >
        <FieldGroup className="gap-3 sm:gap-4">
          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  type="email"
                  placeholder="Email"
                  aria-invalid={fieldState.invalid}
                  className="h-9 w-full text-xs sm:h-10 sm:text-sm"
                  disabled={loginMutation.isPending}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* CNIC */}
          <Controller
            name="cnic"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  inputMode="numeric"
                  placeholder="CNIC Number"
                  maxLength={13}
                  aria-invalid={fieldState.invalid}
                  className="h-9 w-full text-xs sm:h-10 sm:text-sm"
                  disabled={loginMutation.isPending}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  type="password"
                  placeholder="Password"
                  aria-invalid={fieldState.invalid}
                  className="h-9 w-full text-xs sm:h-10 sm:text-sm"
                  disabled={loginMutation.isPending}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* API Error */}
        {loginMutation.isError && (
          <p className="mt-3 text-center text-xs text-red-500">
            {loginMutation.error.message}
          </p>
        )}

        {/* Forgot Password / Register */}
        <div className="mt-3 flex items-center justify-between gap-4 text-[10px] sm:text-xs">
          <Link
            href="/forgot-password"
            className="text-[#3BA6DB] hover:underline"
          >
            Forgot Password?
          </Link>

          <Link
            href="/register"
            className="text-[#3BA6DB] hover:underline"
          >
            Register
          </Link>
        </div>

        {/* Sign In Button */}
        <div className="mt-5 flex justify-center sm:mt-6">
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="h-9 rounded-md bg-auth-background px-5 text-xs text-white hover:bg-[#001033]/90"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}