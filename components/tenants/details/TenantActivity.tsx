import { useTenantActivity } from "@/hooks/tenants/use-tenants";
import { TenantResourceSkeleton } from "@/components/common/loading-skeletons";

export default function TenantActivity({ tenantId }: { tenantId: string }) {
  const { data: tenantActivity = [], isLoading, isError, error } = useTenantActivity(tenantId);
  return (
    <div className="mt-6 rounded-[18px] bg-white p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-[#020D2B]">Platform-level activity</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">Tenant creation, plan changes, suspensions, and impersonation sessions for this tenant. Internal config changes live in the tenant&apos;s own Change Log.</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        {isLoading && <TenantResourceSkeleton />}
        {isError && <p role="alert" className="p-6 text-sm text-red-700">{error.message}</p>}
        <div className="min-w-[650px]">
          {!isLoading && !isError && tenantActivity.map((activity) => (
            <div key={activity.id} className="grid grid-cols-[180px_1fr] border-b border-slate-200 px-2 py-5 last:border-b-0">
              <div className="flex gap-3 text-sm">
                <span className="text-slate-700">{activity.date}</span>
                <span className="text-slate-400">{activity.time}</span>
              </div>

              <p className="text-sm font-medium text-[#020D2B]">{activity.description}</p>
            </div>
          ))}
          {!isLoading && !isError && tenantActivity.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-slate-500">No activity has been recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}