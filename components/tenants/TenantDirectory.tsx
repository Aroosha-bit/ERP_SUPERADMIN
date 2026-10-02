"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { tenants } from "@/data/tenants";
import type { TenantStatus } from "@/types/tenant";
import Breadcrumb from "@/components/common/breadcrumb/page";
import TenantFilters from "./TenantFilters";
import TenantTable from "./TenantTable";

type FilterValue = "All" | TenantStatus;

export default function TenantDirectory() {
  const [filter, setFilter] = useState<FilterValue>("All");

  const counts = useMemo(
    () => ({
      All: tenants.length,
      Active: tenants.filter((tenant) => tenant.status === "Active").length,
      Trial: tenants.filter((tenant) => tenant.status === "Trial").length,
      Onboarding: tenants.filter((tenant) => tenant.status === "Onboarding")
        .length,
      Suspended: tenants.filter((tenant) => tenant.status === "Suspended")
        .length,
    }),
    [],
  );

  const filteredTenants = useMemo(() => {
    if (filter === "All") return tenants;
    return tenants.filter((tenant) => tenant.status === filter);
  }, [filter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tenant Directory" },
        ]}
      />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#020D2B]">All Tenants</h2>
          <p className="mt-1 text-sm text-slate-600">
            Every organization provisioned on the platform. Tenant isolation is
            enforced — this view is platform-only.
          </p>
        </div>

        <Link
          href="/tenants/new"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#020D2B] px-5 text-sm font-medium text-white"
        >
          <Plus size={18} />
          New Tenant
        </Link>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <TenantFilters
          activeFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />

        <button
          type="button"
          className="shrink-0 rounded-md p-2 text-slate-500 hover:bg-white"
        >
          <Filter size={21} />
        </button>
      </div>

      <div className="mt-6">
        <TenantTable data={filteredTenants} />
      </div>
    </div>
  );
}
