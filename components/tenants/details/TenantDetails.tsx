"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/breadcrumb/page";
import { tenants } from "@/data/tenants";
import TenantHeader from "./TenantHeader";
import TenantTabs, { type TenantTab } from "./TenantTabs";
import TenantOverview from "./TenantOverview";
import TenantModules from "./TenantModules";
import TenantUsers from "./TenantUsers";
import TenantActivity from "./TenantActivity";

export default function TenantDetails({ tenantId }: { tenantId: string }) {
  const [activeTab, setActiveTab] = useState<TenantTab>("overview");

  const tenant = tenants.find((item) => item.id === tenantId);

  if (!tenant) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Tenant Directory", href: "/tenants" }, { label: "Tenant Not Found" }]} />
        <div className="mt-8 rounded-xl bg-white p-8 text-center text-slate-600">Tenant not found.</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Tenant Directory", href: "/tenants" }, { label: tenant.name }]} />

      <div className="mt-6">
        <TenantHeader tenant={tenant} />
      </div>

      <div className="mt-6">
        <TenantTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "overview" && <TenantOverview tenant={tenant} />}
      {activeTab === "modules" && <TenantModules />}
      {activeTab === "users" && <TenantUsers />}
      {activeTab === "activity" && <TenantActivity />}
    </div>
  );
}