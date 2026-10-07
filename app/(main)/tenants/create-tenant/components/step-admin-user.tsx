"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminUserData } from "@/hooks/tenants/use-tenant-wizard";

type StepAdminUserProps = {
  adminData: AdminUserData;
  errors?: Record<string, string>;
  onChange: (
    field: keyof AdminUserData,
    value: string
  ) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function StepAdminUser({
  adminData,
  errors,
  onChange,
  onBack,
  onContinue,
}: StepAdminUserProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onContinue();
  }

  return (
    <section className="rounded-2xl bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8 border border-slate-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-[#101d3b]">First Admin User</h2>
        <p className="mt-1 text-sm text-[#4b5568]">
          The initial Tenant Administrator. An invite will be emailed.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-full-name" className="text-sm font-semibold text-[#51586a]">
              Full Name <span className="text-[#36a9e1]">*</span>
            </Label>
            <Input
              id="admin-full-name"
              required
              aria-invalid={Boolean(errors?.fullName)}
              aria-describedby={
                errors?.fullName ? "admin-full-name-error" : undefined
              }
              placeholder="Jane Doe"
              value={adminData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              className={`h-10 rounded-md border bg-white px-3 text-sm text-[#4b5568] placeholder:text-[#a9adb6] ${
                errors?.fullName
                  ? "border-red-500 focus-visible:border-red-500"
                  : "border-[#d7e6ed] focus-visible:border-[#36a9e1]"
              }`}
            />
            {errors?.fullName && (
              <p
                id="admin-full-name-error"
                role="alert"
                className="text-xs text-red-600"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="text-sm font-semibold text-[#51586a]">
              Email <span className="text-[#36a9e1]">*</span>
            </Label>
            <Input
              id="admin-email"
              type="email"
              required
              aria-invalid={Boolean(errors?.email)}
              aria-describedby={errors?.email ? "admin-email-error" : undefined}
              placeholder="admin@plra.gov.pk"
              value={adminData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={`h-10 rounded-md border bg-white px-3 text-sm text-[#4b5568] placeholder:text-[#a9adb6] ${
                errors?.email
                  ? "border-red-500 focus-visible:border-red-500"
                  : "border-[#d7e6ed] focus-visible:border-[#36a9e1]"
              }`}
            />
            {errors?.email && (
              <p
                id="admin-email-error"
                role="alert"
                className="text-xs text-red-600"
              >
                {errors.email}
              </p>
            )}
            <p className="text-xs text-[#828894]">Used as login identity.</p>
          </div>
        </div>

        {/* Role Banner */}
        <div className="rounded-xl bg-[#f4f7fb] border border-[#e5ebf4] px-4 py-3.5 text-xs text-[#4b5568]">
          <span className="font-semibold text-[#101d3b]">Role: </span>
          Tenant Administrator — full configuration access for this organization only.
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[#a8afbd] px-6 text-sm text-[#172440] hover:bg-[#f5f7fa]"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="h-10 bg-[#020d2b] px-6 text-sm font-semibold text-white hover:bg-[#142342] shadow-xs"
          >
            Continue
          </Button>
        </div>
      </form>
    </section>
  );
}
