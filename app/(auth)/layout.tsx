"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/provider/AuthProvider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#001033]">
        <p className="text-sm text-white">Checking authentication...</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#001033]">
      <img
        src="/assets/auth/plra-background.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[65%] w-auto select-none opacity-40 sm:h-[75%] sm:opacity-50 md:h-[85%] md:opacity-70 lg:h-full lg:opacity-100 xl:h-[95%]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[3%] top-0 select-none font-['Times_New_Roman',Times,serif] text-[70px] font-semibold leading-[0.8] text-white/[0.08] sm:text-[90px] md:text-[110px] lg:text-[140px] xl:text-[170px]"
      >
        ERP
      </div>

      <div className="relative z-10 min-h-dvh">{children}</div>
    </main>
  );
}
