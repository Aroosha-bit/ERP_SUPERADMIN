"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface SubModuleItem {
  id: string;
  name: string;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  subModules: SubModuleItem[];
}

export const MODULES_CATALOG: ModuleDefinition[] = [
  {
    id: "hr",
    title: "HR",
    subModules: [
      { id: "hr-opt-1", name: "Attendance & Leaves" },
      { id: "hr-opt-2", name: "Payroll Management" },
      { id: "hr-opt-3", name: "Recruitment & Onboarding" },
      { id: "hr-opt-4", name: "Performance Appraisals" },
      { id: "hr-opt-5", name: "Employee Directory" },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    subModules: [
      { id: "fin-opt-1", name: "General Ledger" },
      { id: "fin-opt-2", name: "Accounts Payable" },
      { id: "fin-opt-3", name: "Accounts Receivable" },
      { id: "fin-opt-4", name: "Taxation & Compliance" },
      { id: "fin-opt-5", name: "Financial Audits" },
    ],
  },
  {
    id: "administration",
    title: "Administration",
    subModules: [
      { id: "adm-opt-1", name: "Facility Management" },
      { id: "adm-opt-2", name: "Fleet & Transport" },
      { id: "adm-opt-3", name: "Office Supplies" },
      { id: "adm-opt-4", name: "Document Archiving" },
    ],
  },
  {
    id: "procurement",
    title: "Procurement",
    subModules: [
      { id: "prc-opt-1", name: "Vendor Management" },
      { id: "prc-opt-2", name: "Purchase Orders" },
      { id: "prc-opt-3", name: "Tendering & RFQ" },
      { id: "prc-opt-4", name: "Contract Tracking" },
    ],
  },
  {
    id: "inventory",
    title: "Inventory Management",
    subModules: [
      { id: "inv-opt-1", name: "Stock Monitoring" },
      { id: "inv-opt-2", name: "Warehouse Storage" },
      { id: "inv-opt-3", name: "Material Requisition" },
      { id: "inv-opt-4", name: "Batch Tracking" },
    ],
  },
  {
    id: "asset",
    title: "Asset Management",
    subModules: [
      { id: "ast-opt-1", name: "Fixed Assets Register" },
      { id: "ast-opt-2", name: "Asset Depreciation" },
      { id: "ast-opt-3", name: "Maintenance & Repairs" },
      { id: "ast-opt-4", name: "Asset Disposal" },
    ],
  },
  {
    id: "pr_coordination",
    title: "PR & Coordination Wing",
    subModules: [
      { id: "pr-opt-1", name: "Media Relations" },
      { id: "pr-opt-2", name: "Citizen Queries" },
      { id: "pr-opt-3", name: "Protocol & Events" },
      { id: "pr-opt-4", name: "Press Releases" },
    ],
  },
];

type StepPlanModulesProps = {
  selectedModules: string[];
  selectedSubModules: string[];
  errors?: Record<string, string>;
  onToggleModule: (moduleId: string) => void;
  onToggleSubModule: (subModuleId: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function StepPlanModules({
  selectedModules,
  selectedSubModules,
  errors,
  onToggleModule,
  onToggleSubModule,
  onBack,
  onContinue,
}: StepPlanModulesProps) {
  // Track which modules have their dropdown options expanded
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  function handleModuleClick(moduleId: string) {
    onToggleModule(moduleId);
    // Expand or toggle the sub-options below
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  }

  return (
    <section className="rounded-2xl bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8 border border-slate-100">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-[#101d3b]">Modules</h2>
        <p className="mt-1 text-sm text-[#4b5568]">
          Choose the modules & sub-modules to enable.
        </p>
      </div>

      {/* 2-Column Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODULES_CATALOG.map((mod) => {
          const isSelected = selectedModules.includes(mod.id);
          const isExpanded = expandedModules[mod.id] ?? false;

          return (
            <div key={mod.id} className="space-y-3">
              {/* Module Header Card */}
              <Label
                htmlFor={`module-${mod.id}`}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-150 select-none ${
                  isSelected
                    ? "border-[#36a9e1] bg-white ring-1 ring-[#36a9e1]"
                    : "border-[#e3e4e7] bg-white hover:border-[#b0d9ed]"
                }`}
              >
                <span className="text-sm font-semibold text-[#101d3b]">
                  {mod.title}
                </span>
                <Checkbox
                  id={`module-${mod.id}`}
                  checked={isSelected}
                  onCheckedChange={() => handleModuleClick(mod.id)}
                  aria-label={`Enable ${mod.title}`}
                />
              </Label>

              {/* Sub-Options List displayed when module is clicked/expanded */}
              {isExpanded && mod.subModules && mod.subModules.length > 0 && (
                <div className="pl-4 space-y-2.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                  {mod.subModules.map((sub) => {
                    const isSubChecked = selectedSubModules.includes(sub.id);
                    return (
                      <Label
                        key={sub.id}
                        htmlFor={`submodule-${sub.id}`}
                        className="group flex cursor-pointer items-center gap-3 select-none"
                      >
                        <Checkbox
                          id={`submodule-${sub.id}`}
                          checked={isSubChecked}
                          onCheckedChange={() => onToggleSubModule(sub.id)}
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

      {errors?.modules && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {errors.modules}
        </p>
      )}

      {/* Helper dependency note */}
      <p className="mt-8 text-xs font-medium text-[#36a9e1]">
        Asset Management requires Finance & Accounts. Payroll requires HR & Payroll.
      </p>

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
    </section>
  );
}
