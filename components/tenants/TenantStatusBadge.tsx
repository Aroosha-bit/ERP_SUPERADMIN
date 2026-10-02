import type { TenantStatus } from "@/types/tenant";

const styles: Record<TenantStatus, string> = {
  Active: "border-green-400 bg-green-50 text-green-600",
  Trial: "border-sky-400 bg-sky-50 text-sky-600",
  Onboarding: "border-orange-400 bg-orange-50 text-orange-600",
  Suspended: "border-red-400 bg-red-50 text-red-600",
};

export default function TenantStatusBadge({ status }: { status: TenantStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {status}
    </span>
  );
}