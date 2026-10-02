"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    value: "conic-gradient(from 180deg at 50% 50%, red, yellow, lime, aqua, blue, magenta, red)",
    isGradient: true,
  },
];

interface StepBrandingProps {
  brandingData: BrandingData;
  organizationName?: string;
  onChange: (field: keyof BrandingData, value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StepBranding({
  brandingData,
  organizationName = "Punjab Land Records Authority",
  onChange,
  onBack,
  onContinue,
}: StepBrandingProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onChange("logoFileName", file.name);
      const url = URL.createObjectURL(file);
      onChange("logoUrl", url);
    }
  }

  const initialLetter = organizationName?.trim() ? organizationName.trim()[0].toUpperCase() : "N";

  return (
    <section className="rounded-2xl bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8 border border-slate-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-[#101d3b]">Branding</h2>
        <p className="mt-1 text-sm text-[#4b5568]">
          How this tenant appears in-app.
        </p>
      </div>

      <div className="space-y-6">
        {/* Primary Colour */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-[#101d3b]">Primary colour</Label>
          <div className="flex flex-wrap items-center gap-3">
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = brandingData.primaryColor === swatch.value;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => onChange("primaryColor", swatch.value)}
                  style={{
                    background: swatch.isGradient ? swatch.value : swatch.value,
                  }}
                  className={`size-11 rounded-lg transition-transform hover:scale-105 cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-[#0a1128] border-2 border-white shadow-sm"
                      : "border border-black/10"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Logo Upload Dropzone */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-[#101d3b]">Logo</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#b9c6d8] py-8 px-4 text-center cursor-pointer hover:bg-[#fbfcfe] transition-colors"
          >
            <p className="text-xs text-[#647087]">
              {brandingData.logoFileName ? (
                <span className="font-semibold text-[#101d3b]">
                  Selected: {brandingData.logoFileName}
                </span>
              ) : (
                "Drop a logo file here, or click to upload — SVG or PNG, max 2MB"
              )}
            </p>
          </div>
        </div>

        {/* Preview of Branding */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-[#101d3b]">
            Preview of Branding
          </Label>
          <div className="rounded-xl border border-[#e3e4e7] p-5 bg-white">
            <div className="flex items-center gap-4">
              {/* Logo / Color square */}
              {brandingData.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brandingData.logoUrl}
                  alt="Logo"
                  className="size-11 rounded-lg object-contain border border-slate-200"
                />
              ) : (
                <div
                  style={{
                    background: brandingData.primaryColor.startsWith("conic")
                      ? "#0a1128"
                      : brandingData.primaryColor,
                  }}
                  className="flex size-11 items-center justify-center rounded-lg text-white font-bold text-lg shadow-xs"
                >
                  {initialLetter}
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-[#101d3b]">
                  {organizationName || "Name"}
                </h4>
                <p className="text-xs text-[#828894]">Preview of in-app branding</p>
              </div>
            </div>
          </div>
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
            type="button"
            className="h-10 bg-[#020d2b] px-6 text-sm font-semibold text-white hover:bg-[#142342] shadow-xs"
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
}
