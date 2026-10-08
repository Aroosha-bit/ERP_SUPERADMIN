import type { TenantCreationPayload } from "@/types/tenant-creation";

export type TenantStatus = "Active" | "Trial" | "Onboarding" | "Suspended";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: TenantStatus;
  modulesEnabled: number;
  totalModules: number;
  createdAt: string;
  lastActive: string;
}

export interface TenantDetails extends Tenant {
  region: string;
  financialYearStart: string;
  baseCurrency: string;
  defaultLanguage: string;
  primaryAdmin: string;
  adminEmail: string;
  ntn?: string;
  address?: string;
  country?: string;
  creationData?: TenantCreationPayload;
}

export interface TenantModule {
  id: string;
  tenantId?: string;
  name: string;
  enabled: boolean;
}

export interface TenantUser {
  id: string;
  tenantId?: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  isAdmin?: boolean;
}

export interface TenantActivityItem {
  id: string;
  tenantId?: string;
  date: string;
  time: string;
  description: string;
}

export interface BusinessUnitOption {
  id: string;
  title: string;
  description: string;
  icon: "building" | "map";
}

export interface ModuleCatalogItem {
  id: string;
  title: string;
  subModules: {
    id: string;
    name: string;
  }[];
}