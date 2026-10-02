import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export interface ModuleItem {
  id: string;
  name: string;
  enabled: boolean;
  subModules: {
    id: string;
    name: string;
    enabled: boolean;
  }[];
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
  modules: {
    moduleId: string;
    moduleName: string;
    enabledSubModules: string[];
  }[];
  adminUser: AdminUserData;
  branding: BrandingData;
}

/**
 * ============================================================================
 * TANSTACK QUERY PLACEHOLDERS
 * ============================================================================
 */

export function useBusinessUnitsQuery() {
  return useQuery({
    queryKey: ["tenants", "business-unit-types"],
    queryFn: async () => {
      return [
        { title: "Head Office", description: "Central operations and administration." },
        { title: "Field Office", description: "Regional or on-site operations." },
        { title: "Other", description: "Description here" },
      ];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrgHierarchyQuery() {
  return useQuery({
    queryKey: ["tenants", "hierarchy-tree"],
    queryFn: async () => {
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useModulesQuery() {
  return useQuery({
    queryKey: ["tenants", "modules-catalog"],
    queryFn: async () => {
      // TODO: Replace with real API endpoint: /api/tenants/modules
      return [
        {
          id: "hr",
          name: "HR",
          subModules: [
            { id: "hr-1", name: "Attendance & Leaves" },
            { id: "hr-2", name: "Payroll Management" },
            { id: "hr-3", name: "Recruitment & Onboarding" },
            { id: "hr-4", name: "Performance Appraisals" },
            { id: "hr-5", name: "Employee Directory" },
          ],
        },
        {
          id: "finance",
          name: "Finance",
          subModules: [
            { id: "fin-1", name: "General Ledger" },
            { id: "fin-2", name: "Accounts Payable" },
            { id: "fin-3", name: "Accounts Receivable" },
            { id: "fin-4", name: "Budgeting & Taxes" },
          ],
        },
        {
          id: "administration",
          name: "Administration",
          subModules: [
            { id: "adm-1", name: "Facility Management" },
            { id: "adm-2", name: "Fleet & Transport" },
            { id: "adm-3", name: "Office Supplies" },
          ],
        },
        {
          id: "procurement",
          name: "Procurement",
          subModules: [
            { id: "prc-1", name: "Vendor Management" },
            { id: "prc-2", name: "Purchase Orders" },
            { id: "prc-3", name: "Tendering & RFQ" },
          ],
        },
        {
          id: "inventory",
          name: "Inventory Management",
          subModules: [
            { id: "inv-1", name: "Stock Tracking" },
            { id: "inv-2", name: "Warehouse Levels" },
            { id: "inv-3", name: "Material Requisition" },
          ],
        },
        {
          id: "asset",
          name: "Asset Management",
          subModules: [
            { id: "ast-1", name: "Fixed Assets Register" },
            { id: "ast-2", name: "Asset Depreciation" },
            { id: "ast-3", name: "Maintenance Logs" },
          ],
        },
        {
          id: "pr_coordination",
          name: "PR & Coordination Wing",
          subModules: [
            { id: "pr-1", name: "Media Relations" },
            { id: "pr-2", name: "Citizen Queries" },
            { id: "pr-3", name: "Protocol & Events" },
          ],
        },
      ];
    },
    staleTime: 1000 * 60 * 30,
  });
}

export function useSaveHierarchyNodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (node: Partial<HierarchyTreeNode>) => {
      console.log("[TanStack Query Placeholder] Saving node:", node);
      return { success: true, node };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants", "hierarchy-tree"] });
    },
  });
}

export function useDeleteHierarchyNodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nodeId: string) => {
      console.log("[TanStack Query Placeholder] Deleting node:", nodeId);
      return { success: true, nodeId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants", "hierarchy-tree"] });
    },
  });
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TenantCreationPayload) => {
      // TODO: Replace with real API endpoint:
      // const response = await fetch("/api/tenants", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // return response.json();

      console.log("[TanStack Query Placeholder] Submitting Complete Tenant Payload:", payload);
      return {
        success: true,
        tenantId: `tenant_${Date.now()}`,
        message: "Tenant created successfully",
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      console.log("[TanStack Query Placeholder] Tenant created successfully:", data);
    },
    onError: (error: Error) => {
      console.error("[TanStack Query Placeholder] Error creating tenant:", error.message);
    },
  });
}


