// Purpose: Validate what the user enters in the Tenant Creation Wizard.

import { z } from "zod";

// ─── Step 0: Organization Basics ─────────────────────────────────────────────
export const organizationBasicsSchema = z.object({
  legalName: z.string().min(1, "Enter Legal Entity Name."),
  slug: z.string().min(1, "Enter Official Code / Slug."),
  ntn: z.string().min(1, "Enter NTN."),
  address: z.string().min(1, "Select Address."),
  country: z.string().min(1, "Select Country / Region."),
  financialYear: z.string().min(1, "Select Financial-Year Start."),
  currency: z.string().min(1, "Select Base Currency."),
  language: z.string().min(1, "Select Default Language."),
});
export type OrganizationBasicsValues = z.infer<typeof organizationBasicsSchema>;

// ─── Step 1: Business Unit ────────────────────────────────────────────────────
export const businessUnitSchema = z
  .object({
    selectedUnit: z.string().min(1, "Select a Business Unit."),
    unitName: z.string().optional(),
    unitCode: z.string().optional(),
    unitDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.selectedUnit === "Other") {
      if (!data.unitName || data.unitName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["unitName"],
          message: "Enter Business Unit Name.",
        });
      }
      if (!data.unitCode || data.unitCode.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["unitCode"],
          message: "Enter Official Code / Slug.",
        });
      }
    }
  });
export type BusinessUnitValues = z.infer<typeof businessUnitSchema>;

// ─── Step 3: Plan & Modules ───────────────────────────────────────────────────
export const planModulesSchema = z.object({
  plan: z.string().min(1, "Select a plan."),
  selectedModules: z
    .array(z.string())
    .min(1, "Select at least one module."),
  selectedSubModules: z.array(z.string()),
});
export type PlanModulesValues = z.infer<typeof planModulesSchema>;

// ─── Step 4: Admin User ───────────────────────────────────────────────────────
export const adminUserSchema = z.object({
  fullName: z.string().min(1, "Enter Full Name."),
  email: z.string().min(1, "Enter Email.").email("Enter a valid Email address."),
  role: z.string().min(1),
});
export type AdminUserValues = z.infer<typeof adminUserSchema>;

// ─── Step 5: Branding ─────────────────────────────────────────────────────────
export const brandingSchema = z.object({
  primaryColor: z.string().min(1, "Select a primary colour."),
  logoFileName: z.string().optional(),
  logoUrl: z.string().optional(),
});
export type BrandingValues = z.infer<typeof brandingSchema>;
