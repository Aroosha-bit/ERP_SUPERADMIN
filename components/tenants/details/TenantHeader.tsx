import type { TenantDetails } from "@/types/tenant";
import TenantStatusBadge from "../TenantStatusBadge";

interface Props {
  tenant: TenantDetails;
}

export default function TenantHeader({ tenant }: Props) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[#020D2B]">{tenant.name}</h2>

        <p className="mt-1 text-sm text-slate-600">{tenant.slug}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <TenantStatusBadge status={tenant.status} />

          <span className="rounded-full border border-fuchsia-400 bg-fuchsia-50 px-3 py-1 text-xs font-medium text-fuchsia-600">
            {tenant.plan}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded-lg border border-slate-400 bg-white px-5 py-2.5 text-sm font-semibold text-[#020D2B] transition-colors hover:bg-slate-50">
          Impersonate
        </button>

        <button type="button" className="rounded-lg border border-slate-400 bg-white px-5 py-2.5 text-sm font-semibold text-[#020D2B] transition-colors hover:bg-slate-50">
          Edit Plan
        </button>

        <button type="button" className="rounded-lg border border-slate-400 bg-white px-5 py-2.5 text-sm font-semibold text-[#020D2B] transition-colors hover:bg-slate-50">
          Suspend
        </button>
      </div>
    </div>
  );
}