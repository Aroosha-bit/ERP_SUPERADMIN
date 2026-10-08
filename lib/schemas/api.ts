import { z } from "zod";
import type { HierarchyTreeNode } from "@/types/tenant-creation";

const hierarchyNodeSchema: z.ZodType<HierarchyTreeNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    code: z.string().optional(),
    status: z.enum(["Pending", "Active", "Inactive"]),
    parentId: z.string().nullable().optional(),
    children: z.array(hierarchyNodeSchema).optional(),
  }),
);

export const tenantCreationPayloadSchema = z.object({
  organization: z.object({
    legalName: z.string(),
    slug: z.string(),
    ntn: z.string(),
    address: z.string(),
    country: z.string(),
    financialYear: z.string(),
    currency: z.string(),
    language: z.string(),
  }),
  businessUnit: z.object({
    type: z.string(),
    details: z.object({
      name: z.string(),
      code: z.string(),
      description: z.string(),
    }).optional(),
  }),
  hierarchy: z.array(hierarchyNodeSchema),
  plan: z.string(),
  totalModules: z.number().int().nonnegative(),
  modules: z.array(z.object({
    moduleId: z.string(),
    moduleName: z.string(),
    enabledSubModules: z.array(z.string()),
  })),
  adminUser: z.object({
    fullName: z.string(),
    email: z.string().email(),
    role: z.string(),
  }),
  branding: z.object({
    primaryColor: z.string(),
    logoUrl: z.string().optional(),
    logoFileName: z.string().optional(),
  }),
});

export const tenantStatusSchema = z.enum([
  "Active",
  "Trial",
  "Onboarding",
  "Suspended",
]);

export const tenantSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    plan: z.string(),
    status: tenantStatusSchema,
    modulesEnabled: z.number(),
    totalModules: z.number(),
    createdAt: z.string(),
    lastActive: z.string(),
    region: z.string(),
    financialYearStart: z.string(),
    baseCurrency: z.string(),
    defaultLanguage: z.string(),
    primaryAdmin: z.string(),
    adminEmail: z.string().email(),
    ntn: z.string().optional(),
    address: z.string().optional(),
    country: z.string().optional(),
    creationData: tenantCreationPayloadSchema.optional(),
  })
  .passthrough();

export const tenantListSchema = z.array(tenantSchema);

export const businessUnitOptionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.enum(["building", "map"]),
});

export const businessUnitOptionsSchema = z.array(businessUnitOptionSchema);

export const moduleCatalogItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subModules: z.array(z.object({ id: z.string(), name: z.string() })),
});

export const moduleCatalogSchema = z.array(moduleCatalogItemSchema);

export const tenantUserSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  initials: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.enum(["Active", "Invited", "Suspended"]),
  isAdmin: z.boolean().optional(),
});

export const tenantUsersSchema = z.array(tenantUserSchema);

export const tenantModuleSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  enabled: z.boolean(),
});

export const tenantModulesSchema = z.array(tenantModuleSchema);

export const tenantActivitySchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  date: z.string(),
  time: z.string(),
  description: z.string(),
});

export const tenantActivitiesSchema = z.array(tenantActivitySchema);
