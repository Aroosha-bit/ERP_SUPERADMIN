"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropDownSelect } from "@/components/ui/drop-down";

import {
  organizationBasicsSchema,
  type OrganizationBasicsValues,
} from "@/lib/schemas/tenant";

const TEXT_FIELDS = [
  {
    name: "legalName" as const,
    label: "Legal Entity Name",
    placeholder: "e.g. Punjab Land Records Authority",
  },
  {
    name: "slug" as const,
    label: "Official Code / Slug",
    placeholder: "plra",
  },
  {
    name: "ntn" as const,
    label: "NTN",
    placeholder: "1234567890",
  },
];

const SELECT_FIELDS = [
  {
    name: "address" as const,
    label: "Address",
    placeholder: "Select Address",
    options: [
      "Multan Road, Lahore",
      "Islamabad",
      "Karachi",
      "Other",
    ],
  },
  {
    name: "country" as const,
    label: "Country / Region",
    placeholder: "Select Country / Region",
    options: [
      "Pakistan",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
    ],
  },
  {
    name: "financialYear" as const,
    label: "Financial-Year Start",
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
    name: "currency" as const,
    label: "Base Currency",
    placeholder: "Select Currency",
    options: [
      "PKR — Pakistani Rupee",
      "USD — US Dollar",
      "AED — UAE Dirham",
      "GBP — British Pound",
    ],
  },
  {
    name: "language" as const,
    label: "Default Language",
    placeholder: "Select Language",
    options: [
      "English",
      "Urdu",
    ],
  },
];

type Props = {
  defaultValues?: Partial<OrganizationBasicsValues>;
  onSubmit: (data: OrganizationBasicsValues) => void;
  onCancel: () => void;
};

export function StepOrganizationBasics({
  defaultValues,
  onSubmit,
  onCancel,
}: Props) {
  const methods = useForm<OrganizationBasicsValues>({
    resolver: zodResolver(organizationBasicsSchema),

    defaultValues: {
      legalName: "",
      slug: "",
      ntn: "",
      address: "",
      country: "",
      financialYear: "",
      currency: "",
      language: "",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#101d3b]">
          Organization Basics
        </h2>

        <p className="mt-1 text-sm text-[#26344f]">
          Core identity for the new tenant. The slug is immutable
          once created.
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">

            {/* Text Inputs */}
            {TEXT_FIELDS.map((field) => {
              const id = `org-${field.name}`;
              const error = errors[field.name];

              return (
                <div
                  key={field.name}
                  className="space-y-1.5"
                >
                  <Label
                    htmlFor={id}
                    className="text-sm font-semibold text-[#51586a]"
                  >
                    {field.label}{" "}
                    <span className="text-[#36a9e1]">
                      *
                    </span>
                  </Label>

                  <Input
                    id={id}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      error
                        ? `${id}-error`
                        : undefined
                    }
                    className={`h-10 rounded-md border bg-white px-2.5 text-sm text-[#4b5568] placeholder:text-[#a9adb6] focus-visible:ring-[#36a9e1]/15 ${
                      error
                        ? "border-red-500 focus-visible:border-red-500"
                        : "border-[#d7e6ed] focus-visible:border-[#36a9e1]"
                    }`}
                  />

                  {error && (
                    <p
                      id={`${id}-error`}
                      role="alert"
                      className="text-xs text-red-600"
                    >
                      {error.message}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Searchable Dropdowns */}
            {SELECT_FIELDS.map((field) => (
              <DropDownSelect
                key={field.name}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                options={field.options}
                searchable
                required
                className="h-10 w-full rounded-md border bg-white px-2.5 text-sm text-[#4b5568] placeholder:text-[#a9adb6] focus-visible:ring-[#36a9e1]/15"
              />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              className="h-10 border-[#a8afbd] px-6 text-sm text-[#172440] hover:bg-[#f5f7fa]"
              onClick={onCancel}
            >
              Back
            </Button>

            <Button
              type="submit"
              className="h-10 bg-[#020d2b] px-6 text-sm font-semibold text-white shadow-xs hover:bg-[#142342]"
            >
              Continue
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}