"use client";

import React, { FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrganizationBasicsData } from "@/hooks/tenants/use-tenant-wizard";

type OrganizationField = keyof OrganizationBasicsData;

const organizationFields: {
  name: OrganizationField;
  label: string;
  type?: "text" | "select";
  options?: string[];
  placeholder?: string;
}[] = [
  {
    name: "legalName",
    label: "Legal Entity Name",
    placeholder: "e.g. Punjab Land Records Authority",
  },
  {
    name: "slug",
    label: "Official Code / Slug",
    placeholder: "plra",
  },
  {
    name: "ntn",
    label: "NTN",
    placeholder: "1234567890",
  },
  {
    name: "address",
    label: "Address",
    type: "select",
    placeholder: "Select Address",
    options: ["Multan Road, Lahore", "Islamabad", "Karachi", "Other"],
  },
  {
    name: "country",
    label: "Country / Region",
    type: "select",
    placeholder: "Select Country / Region",
    options: ["Pakistan", "United Arab Emirates", "United Kingdom", "United States"],
  },
  {
    name: "financialYear",
    label: "Financial-Year Start",
    type: "select",
    placeholder: "Select Month",
    options: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  {
    name: "currency",
    label: "Base Currency",
    type: "select",
    placeholder: "Select Currency",
    options: [
      "PKR — Pakistani Rupee",
      "USD — US Dollar",
      "AED — UAE Dirham",
      "GBP — British Pound",
    ],
  },
  {
    name: "language",
    label: "Default Language",
    type: "select",
    placeholder: "Select Language",
    options: ["English", "Urdu"],
  },
];

interface StepOrganizationBasicsProps {
  data: OrganizationBasicsData;
  onChange: (field: OrganizationField, value: string) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export function StepOrganizationBasics({
  data,
  onChange,
  onCancel,
  onContinue,
}: StepOrganizationBasicsProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onContinue();
  }

  return (
    <section className="rounded-2xl bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8 border border-slate-100">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#101d3b]">Organization Basics</h2>
        <p className="mt-1 text-sm text-[#26344f]">
          Core identity for the new tenant. The slug is immutable once created.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
          {organizationFields.map((field) => {
            const id = `organization-${field.name}`;
            return (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={id} className="text-sm font-semibold text-[#51586a]">
                  {field.label} <span className="text-[#36a9e1]">*</span>
                </Label>
                {field.type === "select" && field.options ? (
                  <div className="relative">
                    <select
                      id={id}
                      required
                      value={data[field.name] || ""}
                      onChange={(event) => onChange(field.name, event.target.value)}
                      className="h-10 w-full appearance-none rounded-md border border-[#d7e6ed] bg-white px-2.5 pr-9 text-sm text-[#4b5568] outline-none transition focus:border-[#36a9e1] focus:ring-2 focus:ring-[#36a9e1]/15 cursor-pointer"
                    >
                      <option value="" disabled>
                        {field.placeholder || `Select ${field.label}`}
                      </option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#697386]"
                    />
                  </div>
                ) : (
                  <Input
                    id={id}
                    name={field.name}
                    required
                    value={data[field.name] || ""}
                    placeholder={field.placeholder}
                    onChange={(event) => onChange(field.name, event.target.value)}
                    className="h-10 rounded-md border-[#d7e6ed] bg-white px-2.5 text-sm text-[#4b5568] placeholder:text-[#a9adb6] focus-visible:border-[#36a9e1] focus-visible:ring-[#36a9e1]/15"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[#a8afbd] px-6 text-sm text-[#172440] hover:bg-[#f5f7fa]"
            onClick={onCancel}
          >
            Cancel
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
