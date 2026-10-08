"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { businessUnitSchema, type BusinessUnitValues } from "@/lib/schemas/tenant";
import { Controller } from "react-hook-form";
import type { BusinessUnitOption } from "@/types/tenant";

type Props = {
  businessUnits: BusinessUnitOption[];
  defaultValues?: Partial<BusinessUnitValues>;
  onSubmit: (data: BusinessUnitValues) => void;
  onBack: () => void;
};

export function StepBusinessUnit({
  businessUnits,
  defaultValues,
  onSubmit,
  onBack,
}: Props) {
  const methods = useForm<BusinessUnitValues>({
    resolver: zodResolver(businessUnitSchema),
    defaultValues: {
      selectedUnit: "",
      unitName: "",
      unitCode: "",
      unitDescription: "",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = methods;

  const selectedUnit = watch("selectedUnit");

  return (
    <section className="rounded-2xl bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8 border border-slate-100">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#101d3b]">Business Unit</h2>
        <p className="mt-1 text-sm text-[#4b5568]">Choose the Business Unit</p>
      </div>

      <FormProvider {...methods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          {/* Radio card group */}
          <Controller
            control={control}
            name="selectedUnit"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                aria-label="Business Unit"
                aria-describedby={errors.selectedUnit ? "business-unit-error" : undefined}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                {businessUnits.map((unit) => {
                  const Icon = unit.icon === "map" ? MapPin : Building2;
                  const isSelected = field.value === unit.title;
                  return (
                    <Label
                      key={unit.title}
                      htmlFor={`business-unit-${unit.id}`}
                      className={`relative flex min-h-28 w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition focus-within:outline-none focus-within:ring-2 focus-within:ring-[#36a9e1] ${
                        isSelected
                          ? "border-2 border-[#36a9e1] bg-white ring-1 ring-[#36a9e1]"
                          : "border-[#e3e4e7] hover:border-[#9bcde4]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg ${
                          unit.id === "other" ? "bg-[#101d3b] text-white" : "bg-[#e8eaf5] text-[#101d3b]"
                        }`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1 pt-1">
                        <span className="block font-semibold text-[#101d3b]">{unit.title}</span>
                        <span className="mt-3 block text-sm leading-5 text-[#626879]">{unit.description}</span>
                      </span>
                      <RadioGroupItem
                        id={`business-unit-${unit.id}`}
                        value={unit.title}
                        className="mt-0.5 size-5"
                      />
                    </Label>
                  );
                })}
              </RadioGroup>
            )}
          />

          {errors.selectedUnit && (
            <p id="business-unit-error" role="alert" className="mt-3 text-sm text-red-600">
              {errors.selectedUnit.message}
            </p>
          )}

          {/* Extra fields when "Other" selected */}
          {selectedUnit === "Other" && (
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 md:grid-cols-3 animate-in fade-in">
              <div className="space-y-1.5">
                <Label htmlFor="other-unit-name" className="text-sm font-semibold text-[#51586a]">
                  Business Unit Name
                </Label>
                <Input
                  id="other-unit-name"
                  {...register("unitName")}
                  placeholder="Name"
                  aria-invalid={Boolean(errors.unitName)}
                  aria-describedby={errors.unitName ? "other-unit-name-error" : undefined}
                  className={`h-10 rounded-md border bg-white px-2.5 text-sm text-[#4b5568] placeholder:text-[#a9adb6] ${
                    errors.unitName
                      ? "border-red-500 focus-visible:border-red-500"
                      : "border-[#d7e6ed] focus-visible:border-[#36a9e1]"
                  }`}
                />
                {errors.unitName && (
                  <p id="other-unit-name-error" role="alert" className="text-xs text-red-600">
                    {errors.unitName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="other-unit-code" className="text-sm font-semibold text-[#51586a]">
                  Official Code / Slug
                </Label>
                <Input
                  id="other-unit-code"
                  {...register("unitCode")}
                  placeholder="code"
                  aria-invalid={Boolean(errors.unitCode)}
                  aria-describedby={errors.unitCode ? "other-unit-code-error" : undefined}
                  className={`h-10 rounded-md border bg-white px-2.5 text-sm text-[#4b5568] placeholder:text-[#a9adb6] ${
                    errors.unitCode
                      ? "border-red-500 focus-visible:border-red-500"
                      : "border-[#d7e6ed] focus-visible:border-[#36a9e1]"
                  }`}
                />
                {errors.unitCode && (
                  <p id="other-unit-code-error" role="alert" className="text-xs text-red-600">
                    {errors.unitCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="other-unit-description" className="text-sm font-semibold text-[#51586a]">
                  Description
                </Label>
                <Input
                  id="other-unit-description"
                  {...register("unitDescription")}
                  placeholder="Description"
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
      </FormProvider>
    </section>
  );
}
