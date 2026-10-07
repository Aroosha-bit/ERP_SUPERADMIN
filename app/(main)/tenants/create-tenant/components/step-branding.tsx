"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { BrandingData } from "@/hooks/tenants/use-tenant-wizard";

const COLOR_SWATCHES = [
  { id: "navy", value: "#0a1128" },
  { id: "sky", value: "#0ea5e9" },
  { id: "green", value: "#10b981" },
  { id: "orange", value: "#f59e0b" },
  { id: "red", value: "#ef4444" },
  { id: "purple", value: "#8b5cf6" },
  { id: "pink", value: "#ec4899" },
  { id: "charcoal", value: "#1e293b" },
  {
    id: "wheel",
    value:
      "conic-gradient(from 180deg at 50% 50%, red, yellow, lime, aqua, blue, magenta, red)",
    isGradient: true,
  },
];

type StepBrandingProps = {
  brandingData: BrandingData;
  organizationName?: string;
  errors?: Record<string, string>;
  onChange: (
    field: keyof BrandingData,
    value: string
  ) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function StepBranding({
  brandingData,
  organizationName = "Punjab Land Records Authority",
  onChange,
  onBack,
  onContinue,
}: StepBrandingProps) {
  function handleFileSelect(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (file) {
      onChange("logoFileName", file.name);

      const url = URL.createObjectURL(file);
      onChange("logoUrl", url);
    }
  }

  const initialLetter = organizationName?.trim()
    ? organizationName.trim()[0].toUpperCase()
    : "N";

  return (
    <section className="relative min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-100 bg-white px-4 py-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-6 sm:py-7">
      {/* Header */}
      <div className="mb-6 min-w-0">
        <h2 className="text-base font-bold text-[#101d3b]">
          Branding
        </h2>

        <p className="mt-1 text-sm text-[#4b5568]">
          How this tenant appears in-app.
        </p>
      </div>

      <div className="min-w-0 space-y-6">
        {/* Primary Colour */}
        <div className="min-w-0 space-y-3">
          <Label className="text-sm font-semibold text-[#101d3b]">
            Primary colour
          </Label>

          <RadioGroup
            value={brandingData.primaryColor}
            onValueChange={(value) => {
              if (typeof value === "string") {
                onChange("primaryColor", value);
              }
            }}
            aria-label="Primary colour"
            className="flex max-w-full flex-wrap items-center gap-3 overflow-hidden"
          >
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected =
                brandingData.primaryColor === swatch.value;

              return (
                <Label
                  key={swatch.id}
                  htmlFor={`branding-color-${swatch.id}`}
                  className="shrink-0 cursor-pointer rounded-lg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#36a9e1]"
                >
                  <RadioGroupItem
                    id={`branding-color-${swatch.id}`}
                    value={swatch.value}
                    aria-label={`${swatch.id} primary colour`}
                    className="sr-only"
                  />

                  <span
                    aria-hidden="true"
                    style={{ background: swatch.value }}
                    className={`block size-10 rounded-lg transition-transform hover:scale-105 sm:size-11 ${
                      isSelected
                        ? "border-2 border-white ring-2 ring-[#0a1128] ring-offset-2 shadow-sm"
                        : "border border-black/10"
                    }`}
                  />
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        {/* Logo Upload Dropzone */}
        <div className="min-w-0 space-y-2">
          <Label className="text-sm font-semibold text-[#101d3b]">
            Logo
          </Label>

          <Input
            id="tenant-logo"
            type="file"
            accept="image/png, image/svg+xml"
            onChange={handleFileSelect}
            className="sr-only"
          />

          <Label
            htmlFor="tenant-logo"
            className="flex min-h-[100px] w-full min-w-0 max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#b9c6d8] px-3 py-4 text-center transition-colors hover:bg-[#fbfcfe]"
          >
            <p className="max-w-full break-words text-xs leading-5 text-[#647087]">
              {brandingData.logoFileName ? (
                <span className="break-all font-semibold text-[#101d3b]">
                  Selected: {brandingData.logoFileName}
                </span>
              ) : (
                "Drop a logo file here, or click to upload — SVG or PNG, max 2MB"
              )}
            </p>
          </Label>
        </div>

        {/* Preview of Branding */}
        <div className="min-w-0 space-y-3">
          <Label className="text-sm font-semibold text-[#101d3b]">
            Preview of Branding
          </Label>

          <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-[#e3e4e7] bg-white p-4 sm:p-5">
            <div className="flex min-w-0 max-w-full items-center gap-3 sm:gap-4">
              {/* Logo / Color square */}
              {brandingData.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brandingData.logoUrl}
                  alt="Logo"
                  className="size-11 shrink-0 rounded-lg border border-slate-200 object-contain"
                />
              ) : (
                <div
                  style={{
                    background:
                      brandingData.primaryColor.startsWith("conic")
                        ? "#0a1128"
                        : brandingData.primaryColor,
                  }}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white shadow-xs"
                >
                  {initialLetter}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-[#101d3b]">
                  {organizationName || "Name"}
                </h4>

                <p className="truncate text-xs text-[#828894]">
                  Preview of in-app branding
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex min-w-0 items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-10 shrink-0 border-[#a8afbd] px-5 text-sm text-[#172440] hover:bg-[#f5f7fa] sm:px-6"
            onClick={onBack}
          >
            Back
          </Button>

          <Button
            type="button"
            className="h-10 shrink-0 bg-[#020d2b] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#142342] sm:px-6"
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
}