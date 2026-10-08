"use client";

import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { brandingSchema, type BrandingValues } from "@/lib/schemas/tenant";

const COLOR_SWATCHES = [
  { id: "navy",     value: "#0a1128" },
  { id: "sky",      value: "#0ea5e9" },
  { id: "green",    value: "#10b981" },
  { id: "orange",   value: "#f59e0b" },
  { id: "red",      value: "#ef4444" },
  { id: "purple",   value: "#8b5cf6" },
  { id: "pink",     value: "#ec4899" },
  { id: "charcoal", value: "#1e293b" },
  {
    id: "wheel",
    value: "conic-gradient(from 180deg at 50% 50%, red, yellow, lime, aqua, blue, magenta, red)",
    isGradient: true,
  },
];

type Props = {
  defaultValues?: Partial<BrandingValues>;
  organizationName?: string;
  onSubmit: (data: BrandingValues) => void;
  onBack: () => void;
};

export function StepBranding({
  defaultValues,
  organizationName = "Punjab Land Records Authority",
  onSubmit,
  onBack,
}: Props) {
  const methods = useForm<BrandingValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: "#0a1128",
      logoFileName: "",
      logoUrl: "",
      ...defaultValues,
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
  } = methods;

  const primaryColor = watch("primaryColor");
  const logoUrl = watch("logoUrl");
  const logoFileName = watch("logoFileName");

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setValue("logoFileName", file.name);
      setValue("logoUrl", URL.createObjectURL(file));
    }
  }

  const initialLetter = organizationName?.trim()
    ? organizationName.trim()[0].toUpperCase()
    : "N";

  return (
    <section className="relative min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-100 bg-white px-4 py-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-6 sm:py-7">
      <div className="mb-6 min-w-0">
        <h2 className="text-base font-bold text-[#101d3b]">Branding</h2>
        <p className="mt-1 text-sm text-[#4b5568]">How this tenant appears in-app.</p>
      </div>

      <FormProvider {...methods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="min-w-0 space-y-6">
            {/* Primary Colour */}
            <div className="min-w-0 space-y-3">
              <Label className="text-sm font-semibold text-[#101d3b]">Primary colour</Label>

              <Controller
                control={control}
                name="primaryColor"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-label="Primary colour"
                    className="flex max-w-full flex-wrap items-center gap-3 overflow-hidden"
                  >
                    {COLOR_SWATCHES.map((swatch) => {
                      const isSelected = field.value === swatch.value;
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
                            className="sr-only py-10"
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
                )}
              />
            </div>

            {/* Logo Upload */}
            <div className="min-w-0 space-y-2">
              <Label className="text-sm font-semibold text-[#101d3b]">Logo</Label>
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
                  {logoFileName ? (
                    <span className="break-all font-semibold text-[#101d3b]">
                      Selected: {logoFileName}
                    </span>
                  ) : (
                    "Drop a logo file here, or click to upload — SVG or PNG, max 2MB"
                  )}
                </p>
              </Label>
            </div>

            {/* Branding Preview */}
            <div className="min-w-0 space-y-3">
              <Label className="text-sm font-semibold text-[#101d3b]">Preview of Branding</Label>
              <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-[#e3e4e7] bg-white p-4 sm:p-5">
                <div className="flex min-w-0 max-w-full items-center gap-3 sm:gap-4">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="size-11 shrink-0 rounded-lg border border-slate-200 object-contain"
                    />
                  ) : (
                    <div
                      style={{
                        background: primaryColor.startsWith("conic") ? "#0a1128" : primaryColor,
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
                    <p className="truncate text-xs text-[#828894]">Preview of in-app branding</p>
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
                type="submit"
                className="h-10 shrink-0 bg-[#020d2b] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#142342] sm:px-6"
              >
                Continue
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}