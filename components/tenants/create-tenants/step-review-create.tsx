"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TenantCreationPayload } from "@/hooks/tenants/use-tenant-wizard";

interface StepReviewCreateProps {
  payload: TenantCreationPayload;
  isSubmitting?: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepReviewCreate({
  payload,
  isSubmitting = false,
  onBack,
  onSubmit,
}: StepReviewCreateProps) {
  const enabledModulesCount = payload.modules.filter(
    (m) => m.enabledSubModules.length > 0 || m.moduleId
  ).length;

  const currencyCode = payload.organization.currency
    ? payload.organization.currency.split(" ")[0]
    : "";
  const fyStart = payload.organization.financialYear || "";
  const currencyFy = currencyCode || fyStart ? `${currencyCode} · ${fyStart}` : "—";

  const reviewItems = [
    {
      label: "Tenant Name",
      value: payload.organization.legalName || "—",
    },
    {
      label: "Business Unit",
      value: payload.businessUnit.type || "—",
    },
    {
      label: "Official Code",
      value: payload.organization.slug || "—",
    },
    {
      label: "NTN",
      value: payload.organization.ntn || "—",
    },
    {
      label: "Address",
      value: payload.organization.address || "—",
    },
    {
      label: "Country",
      value: payload.organization.country || "—",
    },
    {
      label: "Plan",
      value: payload.plan || "Growth",
    },
    {
      label: "Modules",
      value: `${enabledModulesCount} Enabled`,
    },
    {
      label: "Admin",
      value: payload.adminUser.fullName
        ? `${payload.adminUser.fullName} · ${payload.adminUser.email}`
        : "—",
    },
    {
      label: "Currency / FY Start",
      value: currencyFy,
    },
    {
      label: "Language",
      value: payload.organization.language || "—",
    },
  ];

  return (
    <section className="rounded-2xl bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8 border border-slate-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-[#101d3b]">Review & Create</h2>
        <p className="mt-1 text-sm text-[#4b5568]">
          Confirm the details below before provisioning.
        </p>
      </div>

      {/* Review Table / Rows matching image 4 */}
      <div className="space-y-2.5">
        {reviewItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-[#f8fafc] px-4 py-3 text-xs sm:text-sm border border-[#f0f3f6]"
          >
            <span className="text-[#647087] font-medium">{item.label}</span>
            <span className="font-semibold text-[#101d3b] text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
        <Button
          type="button"
          variant="outline"
          className="h-10 border-[#a8afbd] px-6 text-sm text-[#172440] hover:bg-[#f5f7fa] cursor-pointer"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          className="h-10 bg-[#020d2b] px-6 text-sm font-semibold text-white hover:bg-[#142342] shadow-xs disabled:opacity-50 cursor-pointer"
          onClick={onSubmit}
        >
          {isSubmitting ? "Provisioning..." : "Create Tenant"}
        </Button>
      </div>
    </section>
  );
}
