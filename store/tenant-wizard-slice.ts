import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AdminUserValues,
  BrandingValues,
  BusinessUnitValues,
  OrganizationBasicsValues,
  PlanModulesValues,
} from "@/lib/schemas/tenant";
import type { HierarchyTreeNode } from "@/types/tenant-creation";

export interface TenantWizardData {
  organization: OrganizationBasicsValues;
  businessUnit: BusinessUnitValues;
  planModules: PlanModulesValues;
  adminUser: AdminUserValues;
  branding: BrandingValues;
  treeData: HierarchyTreeNode[];
}

export const defaultTenantWizardData: TenantWizardData = {
  organization: {
    legalName: "",
    slug: "",
    ntn: "",
    address: "",
    country: "",
    financialYear: "",
    currency: "",
    language: "",
  },
  businessUnit: {
    selectedUnit: "",
    unitName: "",
    unitCode: "",
    unitDescription: "",
  },
  planModules: {
    plan: "Growth",
    selectedModules: [],
    selectedSubModules: [],
  },
  adminUser: {
    fullName: "",
    email: "",
    role: "Tenant Administrator",
  },
  branding: {
    primaryColor: "#0a1128",
    logoFileName: "",
    logoUrl: "",
  },
  treeData: [],
};

interface TenantWizardState {
  initialized: boolean;
  tenantId: string | null;
  data: TenantWizardData;
  completedSteps: number[];
}

const initialState: TenantWizardState = {
  initialized: false,
  tenantId: null,
  data: defaultTenantWizardData,
  completedSteps: [],
};

const tenantWizardSlice = createSlice({
  name: "tenantWizard",
  initialState,
  reducers: {
    resetTenantWizard: () => initialState,
    initializeTenantWizard(
      _state,
      action: PayloadAction<{
        tenantId: string | null;
        data: TenantWizardData;
        completedSteps: number[];
      }>,
    ) {
      return { initialized: true, ...action.payload };
    },
    updateTenantWizardStep(
      state,
      action: PayloadAction<{
        activeStep: number;
        data: Partial<TenantWizardData>;
      }>,
    ) {
      state.data = { ...state.data, ...action.payload.data };
      state.completedSteps = [
        ...state.completedSteps.filter((step) => step < action.payload.activeStep),
        action.payload.activeStep,
      ];
    },
    setTenantWizardHierarchy(state, action: PayloadAction<HierarchyTreeNode[]>) {
      state.data.treeData = action.payload;
    },
  },
});

export const {
  initializeTenantWizard,
  resetTenantWizard,
  setTenantWizardHierarchy,
  updateTenantWizardStep,
} = tenantWizardSlice.actions;
export default tenantWizardSlice.reducer;
