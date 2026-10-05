"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { tenants } from "@/data/tenants";
import type { TenantStatus } from "@/types/tenant";
import PageContainer from "@/components/common/page-container/PageContainer";
import PageHeader from "@/components/common/page-header/PageHeader";
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
      Onboarding: tenants.filter((tenant) => tenant.status === "Onboarding").length,
      Suspended: tenants.filter((tenant) => tenant.status === "Suspended").length,
    }),
    [],
  );

  const filteredTenants = useMemo(() => {
    if (filter === "All") return tenants;

    return tenants.filter((tenant) => tenant.status === filter);
  }, [filter]);

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Tenant Directory" },
      ]}
    >
      <PageHeader
        title="All Tenants"
        description="Every organization provisioned on the platform. Tenant isolation is enforced — this view is platform-only."
        actions={
          <Link href="/tenants/create-tenant" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#020D2B] px-5 text-sm font-medium text-white">
            <Plus size={18} />
            New Tenant
          </Link>
        }
      />

      <div className="mt-7 flex items-center justify-between gap-4">
        <TenantFilters activeFilter={filter} onFilterChange={setFilter} counts={counts} />

        <button type="button" className="shrink-0 rounded-md p-2 text-slate-500 hover:bg-white">
          <Filter size={21} />
        </button>
      </div>

      <div className="mt-6">
        <TenantTable data={filteredTenants} />
      </div>
    </PageContainer>
  );
}