"use client";

import React, { FormEvent } from "react";
import { Building2, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BusinessUnitDetails } from "@/hooks/tenants/use-tenant-wizard";

export const BUSINESS_UNITS = [
  {
    id: "head_office",
    title: "Head Office",
    description: "Central operations and administration.",
    icon: Building2,
    isDarkIcon: false,
  },
  {
    id: "field_office",
    title: "Field Office",
    description: "Regional or on-site operations.",
    icon: MapPin,
    isDarkIcon: false,
  },
  {
    id: "other",
    title: "Other",
    description: "Description here",
    icon: Building2,
    isDarkIcon: true,
  },
];

interface StepBusinessUnitProps {
  selectedUnit: string;
  unitError?: string;
  otherDetails: BusinessUnitDetails;
  onSelectUnit: (unit: string) => void;
  onOtherDetailsChange: (details: BusinessUnitDetails) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StepBusinessUnit({
  selectedUnit,
  unitError,
  otherDetails,
  onSelectUnit,
  onOtherDetailsChange,
  onBack,
  onContinue,
}: StepBusinessUnitProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onContinue();
  }

  return (
    <section className="rounded-2xl bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8 border border-slate-100">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#101d3b]">Business Unit</h2>
        <p className="mt-1 text-sm text-[#4b5568]">Choose the Business Unit</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Selection Cards Grid */}
        <div
          role="radiogroup"
          aria-label="Business Unit"
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {BUSINESS_UNITS.map((unit) => {
            const Icon = unit.icon;
            const isSelected = selectedUnit === unit.title;
            return (
              <button
                key={unit.title}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectUnit(unit.title)}
                className={`relative flex min-h-28 w-full items-start gap-3 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36a9e1] ${
                  isSelected
                    ? "border-2 border-[#36a9e1] bg-white ring-1 ring-[#36a9e1]"
                    : "border-[#e3e4e7] hover:border-[#9bcde4]"
                }`}
              >
                <span
                  className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    unit.isDarkIcon
                      ? "bg-[#101d3b] text-white"
                      : "bg-[#e8eaf5] text-[#101d3b]"
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1 pt-1">
                  <span className="block font-semibold text-[#101d3b]">
                    {unit.title}
                  </span>
                  <span className="mt-3 block text-sm leading-5 text-[#626879]">
                    {unit.description}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? "border-[#36a9e1] bg-[#36a9e1] text-white"
                      : "border-[#d4e7f0]"
                  }`}
                >
                  {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                </span>
              </button>
            );
          })}
        </div>

        {unitError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {unitError}
          </p>
        )}

        {/* Dynamic Fields when 'Other' is Selected */}
        {selectedUnit === "Other" && (
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 md:grid-cols-3 animate-in fade-in">
            <div className="space-y-1.5">
              <Label htmlFor="other-unit-name" className="text-sm font-semibold text-[#51586a]">
                Business Unit Name
              </Label>
              <Input
                id="other-unit-name"
                placeholder="Name"
                value={otherDetails.name}
                onChange={(e) =>
                  onOtherDetailsChange({ ...otherDetails, name: e.target.value })
                }
                className="h-10 rounded-md border-[#d7e6ed] bg-white px-2.5 text-sm text-[#4b5568] placeholder:text-[#a9adb6] focus-visible:border-[#36a9e1]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="other-unit-code" className="text-sm font-semibold text-[#51586a]">
                Official Code/Slug
              </Label>
              <Input
                id="other-unit-code"
                placeholder="code"
                value={otherDetails.code}
                onChange={(e) =>
                  onOtherDetailsChange({ ...otherDetails, code: e.target.value })
                }
                className="h-10 rounded-md border-[#d7e6ed] bg-white px-2.5 text-sm text-[#4b5568] placeholder:text-[#a9adb6] focus-visible:border-[#36a9e1]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="other-unit-description" className="text-sm font-semibold text-[#51586a]">
                Description
              </Label>
              <Input
                id="other-unit-description"
                placeholder="Description"
                value={otherDetails.description}
                onChange={(e) =>
                  onOtherDetailsChange({ ...otherDetails, description: e.target.value })
                }
                className="h-10 rounded-md border-[#d7e6ed] bg-white px-2.5 text-sm text-[#4b5568] placeholder:text-[#a9adb6] focus-visible:border-[#36a9e1]"
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[#a8afbd] px-6 text-sm text-[#172440] hover:bg-[#f5f7fa]"
            onClick={onBack}
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
