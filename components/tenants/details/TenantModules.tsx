"use client";

import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTenantModules, useUpdateTenantModuleMutation } from "@/hooks/tenants/use-tenants";
import { TenantResourceSkeleton } from "@/components/common/loading-skeletons";

export default function TenantModules({ tenantId }: { tenantId: string }) {
  const [supportOverride, setSupportOverride] = useState(false);
  const { data: modules = [], isLoading, isError, error } = useTenantModules(tenantId);
  const updateModule = useUpdateTenantModuleMutation(tenantId);

  function toggleModule(moduleId: string) {
    if (!supportOverride) return;
    const selectedModule = modules.find((item) => item.id === moduleId);
    if (selectedModule) {
      updateModule.mutate({
        moduleId,
        enabled: !selectedModule.enabled,
      });
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-start gap-3 rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-4 text-sm text-slate-700">
        <CircleAlert size={19} className="mt-0.5 shrink-0 text-[#020D2B]" />

        <p>
          Day-to-day module enablement is managed by this tenant&apos;s own
          admins in their console. This view is read-only, scoped by their{" "}
          <strong>Enterprise</strong> plan.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          Support override — allow platform operator to toggle modules directly
          for this tenant
        </p>

        <Switch
          checked={supportOverride}
          onCheckedChange={setSupportOverride}
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-[18px] bg-white">
        {isLoading && <TenantResourceSkeleton />}
        {isError && <p role="alert" className="p-6 text-sm text-red-700">{error.message}</p>}
        {updateModule.isError && (
          <p role="alert" className="p-4 text-sm text-red-700">
            {updateModule.error.message}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#020D2B]">
                  Modules
                </th>
                <th className="w-[30%] px-6 py-4 text-left text-sm font-semibold text-[#020D2B]">
                  Enabled
                </th>
              </tr>
            </thead>

            <tbody>
              {!isLoading && !isError && modules.map((module) => (
                <tr
                  key={module.id}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {module.name}
                  </td>

                  <td className="px-6 py-4">
                    <Switch
                      checked={module.enabled}
                      disabled={!supportOverride || updateModule.isPending}
                      onCheckedChange={() => toggleModule(module.id)}
                    />
                  </td>
                </tr>
              ))}
              {!isLoading && !isError && modules.length === 0 && (
                <tr><td colSpan={2} className="px-6 py-10 text-center text-sm text-slate-500">No modules found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
