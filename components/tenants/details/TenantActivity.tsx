import { tenantActivity } from "@/data/tenants";

export default function TenantActivity() {
  return (
    <div className="mt-6 rounded-[18px] bg-white p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-[#020D2B]">Platform-level activity</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">Tenant creation, plan changes, suspensions, and impersonation sessions for this tenant. Internal config changes live in the tenant&apos;s own Change Log.</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[650px]">
          {tenantActivity.map((activity) => (
            <div key={activity.id} className="grid grid-cols-[180px_1fr] border-b border-slate-200 px-2 py-5 last:border-b-0">
              <div className="flex gap-3 text-sm">
                <span className="text-slate-700">{activity.date}</span>
                <span className="text-slate-400">{activity.time}</span>
              </div>

              <p className="text-sm font-medium text-[#020D2B]">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}