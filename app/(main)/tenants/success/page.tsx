"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function SuccessPage() {
  const router = useRouter();

  const [countdown, setCountdown] = useState(5);

  // Countdown: 5 → 4 → 3 → 2 → 1 → 0
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      router.replace("/dashboard");
    }
  }, [countdown, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F8FAFC] px-4">
      <div className="flex w-full max-w-[520px] flex-col items-center rounded-2xl bg-white px-6 py-10 text-center shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:px-10 sm:py-12">

        {/* Success Animation */}
        <div className="h-[180px] w-[180px] sm:h-[220px] sm:w-[220px]">
          <DotLottieReact
            src="/animations/success.json"
            loop={false}
            autoplay
          />
        </div>

        {/* Heading */}
        <h1 className="mt-2 text-xl font-bold text-[#101D3B] sm:text-2xl">
          Tenant Created Successfully!
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-[400px] text-sm leading-6 text-[#647087]">
          Your tenant has been successfully provisioned and is ready to use.
        </p>

        {/* Countdown */}
        <div className="mt-7">
          <p className="text-sm text-[#647087]">
            You will be redirected to the dashboard in
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-[#020D2B]">
              {countdown}
            </span>

            <span className="text-sm text-[#647087]">
              {countdown === 1 ? "second" : "seconds"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#00C885] transition-all duration-1000 ease-linear"
            style={{
              width: `${((5 - countdown) / 5) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}