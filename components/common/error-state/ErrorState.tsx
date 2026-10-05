import Link from "next/link";
import { CircleAlert } from "lucide-react";

interface ErrorStateProps {
  code?: string;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function ErrorState({
  code,
  title,
  message,
  actionLabel = "Back to Dashboard",
  actionHref = "/dashboard",
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-91px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
          <CircleAlert size={32} className="text-[#020D2B]" />
        </div>

        {code && (
          <h1 className="mt-6 text-6xl font-bold text-[#020D2B]">{code}</h1>
        )}

        <h2 className="mt-3 text-xl font-semibold text-[#020D2B]">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>

        <Link
          href={actionHref}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#020D2B] px-6 text-sm font-medium text-white transition-colors hover:bg-[#182544]"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
