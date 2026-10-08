import { Skeleton } from "@/components/ui/skeleton";

export function AppLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading application"
      className="min-h-screen p-6 lg:p-8"
    >
      <span className="sr-only">Loading application...</span>
      <div className="mx-auto max-w-7xl space-y-8">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function AuthLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Checking authentication"
      className="flex min-h-dvh w-full items-center justify-center px-4"
    >
      <span className="sr-only">Checking authentication...</span>
      <div className="w-full max-w-[440px] space-y-6 rounded-2xl bg-white/10 p-8">
        <Skeleton className="mx-auto h-8 w-48 bg-white/20" />
        <Skeleton className="mx-auto h-4 w-32 bg-white/20" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-11 w-full bg-white/20" />
          <Skeleton className="h-11 w-full bg-white/20" />
          <Skeleton className="h-11 w-full bg-white/20" />
          <Skeleton className="mx-auto h-10 w-28 bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export function TenantDirectorySkeleton() {
  return (
    <div role="status" aria-label="Loading tenants" className="space-y-7">
      <span className="sr-only">Loading tenants...</span>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-11 w-32 shrink-0" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        <Skeleton className="h-9 w-20 shrink-0" />
        <Skeleton className="h-9 w-24 shrink-0" />
        <Skeleton className="h-9 w-24 shrink-0" />
        <Skeleton className="h-9 w-28 shrink-0" />
        <Skeleton className="h-9 w-24 shrink-0" />
      </div>
      <div className="overflow-hidden rounded-[18px] bg-white p-5">
        <div className="space-y-4">
          <div className="flex gap-4 border-b border-slate-100 pb-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-4 flex-1" />
            ))}
          </div>
          {Array.from({ length: 5 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0"
            >
              {Array.from({ length: 6 }, (_, cellIndex) => (
                <Skeleton
                  key={cellIndex}
                  className={`h-5 flex-1 ${
                    cellIndex === 0 ? "max-w-44" : "max-w-28"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TenantResourceSkeleton() {
  return (
    <div role="status" aria-label="Loading tenant data" className="space-y-4 p-6">
      <span className="sr-only">Loading tenant data...</span>
      <Skeleton className="h-5 w-36" />
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-slate-100 py-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export function TenantWizardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading tenant creation"
      className="space-y-8"
    >
      <span className="sr-only">Loading tenant creation...</span>
      <div className="flex justify-between gap-3">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <Skeleton className="size-11 rounded-full" />
            <Skeleton className="h-3 w-full max-w-24" />
          </div>
        ))}
      </div>
      <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-5">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}
