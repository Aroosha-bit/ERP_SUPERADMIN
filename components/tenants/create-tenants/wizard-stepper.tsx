"use client";

import React from "react";
import {
  Briefcase,
  Building2,
  Check,
  FileSearch,
  Network,
  Palette,
  PanelsTopLeft,
  UserRoundPlus,
} from "lucide-react";

export const WIZARD_STEPS = [
  { id: 0, label: "Organization Basics", icon: Building2 },
  { id: 1, label: "Business Unit", icon: Briefcase },
  { id: 2, label: "Org. Hierarchy", icon: Network },
  { id: 3, label: "Plan & Modules", icon: PanelsTopLeft },
  { id: 4, label: "First Admin User", icon: UserRoundPlus },
  { id: 5, label: "Branding", icon: Palette },
  { id: 6, label: "Review & Create", icon: FileSearch },
];

interface WizardStepperProps {
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function WizardStepper({ activeStep, onStepClick }: WizardStepperProps) {
  return (
    <ol
      aria-label="Tenant creation progress"
      className="mb-8 flex items-start justify-between gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none"
    >
      {WIZARD_STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeStep;
        const isComplete = index < activeStep;

        return (
          <li
            key={step.label}
            aria-current={isActive ? "step" : undefined}
            className="relative flex min-w-[105px] flex-1 flex-col items-center text-center cursor-pointer"
            onClick={() => onStepClick && onStepClick(index)}
          >
            {/* Connecting line to the left */}
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2 transition-colors duration-200 ${
                  index <= activeStep ? "bg-[#36a9e1]" : "bg-[#e1e7ef]"
                }`}
              />
            )}

            {/* Step Icon Circle */}
            <span
              className={`relative z-10 flex size-11 items-center justify-center rounded-full border transition-all duration-200 ${
                isComplete
                  ? "border-[#36a9e1] bg-[#36a9e1] text-white shadow-xs"
                  : isActive
                    ? "border-2 border-[#36a9e1] bg-white text-[#36a9e1] shadow-xs"
                    : "border-[#c9c9c9] bg-white text-[#a5a7aa]"
              }`}
            >
              {isComplete ? (
                <Check className="size-5 stroke-[2.5]" />
              ) : (
                <Icon className="size-5" />
              )}
            </span>

            {/* Step Label */}
            <div className="mt-2 flex flex-col items-center">
              <span
                className={`whitespace-nowrap text-[11px] sm:text-xs transition-colors duration-200 ${
                  isActive
                    ? "font-bold text-[#101d3b]"
                    : isComplete
                      ? "font-semibold text-[#101d3b]"
                      : "font-medium text-[#a6a9af]"
                }`}
              >
                {step.label}
              </span>

              {/* Active Indicator Underline */}
              {isActive && (
                <div className="mt-1 h-[2px] w-7 rounded-full bg-[#36a9e1]" />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
