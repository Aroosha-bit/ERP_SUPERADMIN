import type { TenantDetails } from "@/types/tenant";

export default function TenantOverview({ tenant }: { tenant: TenantDetails }) {
  const details = [
    { label: "Region", value: tenant.region },
    { label: "Financial Year Start", value: tenant.financialYearStart },
    { label: "Base Currency", value: tenant.baseCurrency },
    { label: "Default language", value: tenant.defaultLanguage },
    { label: "Created", value: tenant.createdAt },
    { label: "Last active", value: tenant.lastActive },
    { label: "Primary Admin", value: tenant.primaryAdmin },
    { label: "Admin Email", value: tenant.adminEmail },
    { label: "Modules Enabled", value: `${tenant.modulesEnabled} of ${tenant.totalModules}` },
  ];

  return (
    <div className="mt-6 rounded-[18px] bg-white p-5 sm:p-7 lg:p-8">
      <h3 className="text-lg font-semibold text-[#020D2B]">Organization Basics</h3>

      <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {details.map((item) => (
          <div key={item.label}>
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-1 break-words font-semibold text-[#020D2B]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}