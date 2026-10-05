"use client";

import { CircleAlert, RotateCcw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <CircleAlert size={32} className="text-red-500" />
        </div>

        <h1 className="mt-6 text-xl font-semibold text-[#020D2B]">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          We could not complete your request. Please try again.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <p className="mt-4 rounded-lg bg-slate-100 p-3 text-left text-xs text-slate-500">
            {error.message}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#020D2B] px-6 text-sm font-medium text-white transition-colors hover:bg-[#182544]"
        >
          <RotateCcw size={17} />
          Try Again
        </button>
      </div>
    </div>
  );
}
