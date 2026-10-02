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
}

export interface TenantModule {
  id: string;
  name: string;
  enabled: boolean;
}

export interface TenantUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  isAdmin?: boolean;
}

export interface TenantActivityItem {
  id: string;
  date: string;
  time: string;
  description: string;
}