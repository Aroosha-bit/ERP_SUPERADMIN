export interface BusinessUnitDetails {
  name: string;
  code: string;
  description: string;
}

export type OrgNodeType =
  | "Authority"
  | "Head Office"
  | "Wing / Cost Centers"
  | "Operations"
  | "Region / Division"
  | "District"
  | "Tehsil"
  | "Field Service";

export interface HierarchyTreeNode {
  id: string;
  name: string;
  type: OrgNodeType | string;
  code?: string;
  status: "Pending" | "Active" | "Inactive";
  parentId?: string | null;
  children?: HierarchyTreeNode[];
}

export interface OrganizationBasicsData {
  legalName: string;
  slug: string;
  ntn: string;
  address: string;
  country: string;
  financialYear: string;
  currency: string;
  language: string;
}

export interface AdminUserData {
  fullName: string;
  email: string;
  role: string;
}

export interface BrandingData {
  primaryColor: string;
  logoUrl?: string;
  logoFileName?: string;
}

export interface TenantCreationPayload {
  organization: OrganizationBasicsData;
  businessUnit: {
    type: string;
    details?: BusinessUnitDetails;
  };
  hierarchy: HierarchyTreeNode[];
  plan: string;
  totalModules: number;
  modules: {
    moduleId: string;
    moduleName: string;
    enabledSubModules: string[];
  }[];
  adminUser: AdminUserData;
  branding: BrandingData;
}
