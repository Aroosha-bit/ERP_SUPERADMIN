"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { planModulesSchema, type PlanModulesValues } from "@/lib/schemas/tenant";
import { useState } from "react";
import type { ModuleCatalogItem } from "@/types/tenant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  modules: ModuleCatalogItem[];
  defaultValues?: Partial<PlanModulesValues>;
  onSubmit: (data: PlanModulesValues) => void;
  onBack: () => void;
};

export function StepPlanModules({
  modules,
  defaultValues,
  onSubmit,
  onBack,
}: Props) {
  const methods = useForm<PlanModulesValues>({
    resolver: zodResolver(planModulesSchema),
    defaultValues: {
      plan: "Growth",
      selectedModules: [],
      selectedSubModules: [],
      ...defaultValues,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = methods;

  // UI-only state: which module panels are expanded
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const selectedModules = watch("selectedModules");
  const selectedSubModules = watch("selectedSubModules");

  function toggleModule(moduleId: string) {
    const current = selectedModules ?? [];
    const next = current.includes(moduleId)
      ? current.filter((id) => id !== moduleId)
      : [...current, moduleId];
    setValue("selectedModules", next, { shouldValidate: true });
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  }

  function toggleSubModule(subId: string) {
    const current = selectedSubModules ?? [];
    const next = current.includes(subId)
      ? current.filter((id) => id !== subId)
      : [...current, subId];
    setValue("selectedSubModules", next);
  }

  return (
    <section className="rounded-2xl bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8 border border-slate-100">
      <div className="mb-6">
        <h2 className="text-base font-bold text-[#101d3b]">Modules</h2>
        <p className="mt-1 text-sm text-[#4b5568]">Choose the modules & sub-modules to enable.</p>
      </div>

      <FormProvider {...methods}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 max-w-sm space-y-2">
            <Label htmlFor="tenant-plan">Plan</Label>
            <Select
              value={watch("plan")}
              onValueChange={(value) => {
                if (value) {
                  setValue("plan", value, { shouldValidate: true });
                }
              }}
            >
              <SelectTrigger id="tenant-plan" aria-invalid={Boolean(errors.plan)}>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {["Starter", "Growth", "Enterprise", "Trial"].map((plan) => (
                  <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.plan && <p role="alert" className="text-sm text-red-600">{errors.plan.message}</p>}
            <input type="hidden" {...register("plan")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod) => {
              const isSelected = (selectedModules ?? []).includes(mod.id);
              const isExpanded = expandedModules[mod.id] ?? false;

              return (
                <div key={mod.id} className="space-y-3">
                  <Label
                    htmlFor={`module-${mod.id}`}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-150 select-none ${
                      isSelected
                        ? "border-[#36a9e1] bg-white ring-1 ring-[#36a9e1]"
                        : "border-[#e3e4e7] bg-white hover:border-[#b0d9ed]"
                    }`}
                  >
                    <span className="text-sm font-semibold text-[#101d3b]">{mod.title}</span>
                    <Checkbox
                      id={`module-${mod.id}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleModule(mod.id)}
                      aria-label={`Enable ${mod.title}`}
                    />
                  </Label>

                  {isExpanded && mod.subModules.length > 0 && (
                    <div className="pl-4 space-y-2.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                      {mod.subModules.map((sub) => {
                        const isSubChecked = (selectedSubModules ?? []).includes(sub.id);
                        return (
                          <Label
                            key={sub.id}
                            htmlFor={`submodule-${sub.id}`}
                            className="group flex cursor-pointer items-center gap-3 select-none"
                          >
                            <Checkbox
                              id={`submodule-${sub.id}`}
                              checked={isSubChecked}
                              onCheckedChange={() => toggleSubModule(sub.id)}
                              aria-label={`Enable ${sub.name}`}
                            />
                            <span className="text-xs text-[#51586a] group-hover:text-[#101d3b]">
                              {sub.name}
                            </span>
                          </Label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {errors.selectedModules && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {errors.selectedModules.message}
            </p>
          )}

          <p className="mt-8 text-xs font-medium text-[#36a9e1]">
            Asset Management requires Finance & Accounts. Payroll requires HR & Payroll.
          </p>

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
