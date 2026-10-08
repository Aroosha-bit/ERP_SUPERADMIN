"use client";

import { useState } from "react";
import PageContainer from "@/components/common/page-container/PageContainer";
import TenantHeader from "./TenantHeader";
import TenantTabs, { type TenantTab } from "./TenantTabs";
import TenantOverview from "./TenantOverview";
import TenantModules from "./TenantModules";
import TenantUsers from "./TenantUsers";
import TenantActivity from "./TenantActivity";
import { useTenant } from "@/hooks/tenants/use-tenants";
import { TenantDirectorySkeleton } from "@/components/common/loading-skeletons";

export default function TenantDetails({ tenantId }: { tenantId: string }) {
  const [activeTab, setActiveTab] = useState<TenantTab>("overview");
  const { data: tenant, isLoading, isError, error } = useTenant(tenantId);

  if (isLoading) {
    return (
      <PageContainer breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Tenant Directory", href: "/tenants" }]}>
        <TenantDirectorySkeleton />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Tenant Directory", href: "/tenants" }]}>
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error.message}</p>
      </PageContainer>
    );
  }

  if (!tenant) {
    return (
      <PageContainer
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tenant Directory", href: "/tenants" },
          { label: "Tenant Not Found" },
        ]}
      >
        <div className="rounded-xl bg-white p-8 text-center text-slate-600">
          Tenant not found.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Tenant Directory", href: "/tenants" },
        { label: tenant.name },
      ]}
    >
      <TenantHeader tenant={tenant} />

      <div className="mt-6">
        <TenantTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "overview" && <TenantOverview tenant={tenant} />}
      {activeTab === "modules" && <TenantModules tenantId={tenant.id} />}
      {activeTab === "users" && <TenantUsers tenantId={tenant.id} />}
      {activeTab === "activity" && <TenantActivity tenantId={tenant.id} />}
    </PageContainer>
  );
}