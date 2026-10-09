"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Filter, Plus } from "lucide-react";
// import { tenants } from "@/data/tenants";
import type { TenantStatus } from "@/types/tenant";
import type { TenantDetails } from "@/types/tenant";
import { useDispatch, useSelector } from "react-redux";
import PageContainer from "@/components/common/page-container/PageContainer";
import PageHeader from "@/components/common/page-header/PageHeader";
import TenantFilters from "./TenantFilters";
import TenantTable from "./TenantTable";
import { useTenants } from "@/hooks/tenants/use-tenants";
import { TenantDirectorySkeleton } from "@/components/common/loading-skeletons";
import type { AppDispatch, RootState } from "@/store/store";
import { setTenantDirectoryFilter } from "@/store/tenant-directory-slice";

const EMPTY_TENANTS: TenantDetails[] = [];

export default function TenantDirectory() {
  const dispatch = useDispatch<AppDispatch>();
  const filter = useSelector((state: RootState) => state.tenantDirectory.filter);

  const { data, isLoading, isError, error } = useTenants();
  const tenants = data ?? EMPTY_TENANTS;

  const counts = useMemo(
    () => ({
      All: tenants.length,
      Active: tenants.filter((tenant) => tenant.status === "Active").length,
      Trial: tenants.filter((tenant) => tenant.status === "Trial").length,
      Onboarding: tenants.filter((tenant) => tenant.status === "Onboarding").length,
      Suspended: tenants.filter((tenant) => tenant.status === "Suspended").length,
    }),
    [tenants],
  );
  const filteredTenants = filter === "All"
    ? tenants
    : tenants.filter((tenant) => tenant.status === filter);

  if (isLoading) {
    return (
      <PageContainer
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tenant Directory" },
        ]}
      >
        <TenantDirectorySkeleton />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    );
  }
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
          <Link
            href="/tenants/create-tenant/organization-basics?new=1"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#020D2B] px-5 text-sm font-medium text-white"
          >
            <Plus size={18} />
            New Tenant
          </Link>
        }
      />

      <div className="mt-7 flex items-center justify-between gap-4">
        <TenantFilters
          activeFilter={filter}
          onFilterChange={(value) => dispatch(setTenantDirectoryFilter(value))}
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
    </PageContainer>
  );
}
