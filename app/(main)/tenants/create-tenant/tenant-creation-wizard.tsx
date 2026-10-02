"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  WizardStepper,
  StepOrganizationBasics,
  StepBusinessUnit,
  StepOrgHierarchy,
  StepPlanModules,
  StepAdminUser,
  StepBranding,
  StepReviewCreate,
} from "@/components/tenants/create-tenants";
import {
  useCreateTenantMutation,
  useBusinessUnitsQuery,
  useOrgHierarchyQuery,
  useModulesQuery,
  type OrganizationBasicsData,
  type BusinessUnitDetails,
  type HierarchyTreeNode,
  type AdminUserData,
  type BrandingData,
  type TenantCreationPayload,
} from "@/hooks/tenants/use-tenant-wizard";
import Breadcrumb from "@/components/common/breadcrumb/page";

// Initial sample tree matching image 2
const defaultTreeData: HierarchyTreeNode[] = [
  {
    id: "bor",
    name: "Board of Revenue (BOR)",
    type: "Authority",
    code: "BOR-001",
    status: "Active",
    parentId: null,
    children: [
      {
        id: "plra",
        name: "PLRA Authority",
        type: "Authority",
        code: "PLRA-001",
        status: "Active",
        parentId: "bor",
        children: [
          {
            id: "head-office",
            name: "Head Office",
            type: "Head Office",
            code: "HO-01",
            status: "Active",
            parentId: "plra",
            children: [
              {
                id: "finance",
                name: "Finance",
                type: "Wing / Cost Centers",
                code: "W-FIN",
                status: "Active",
                parentId: "head-office",
              },
              {
                id: "hr",
                name: "Human Resource",
                type: "Wing / Cost Centers",
                code: "W-HR",
                status: "Active",
                parentId: "head-office",
              },
              {
                id: "it",
                name: "IT",
                type: "Wing / Cost Centers",
                code: "W-IT",
                status: "Active",
                parentId: "head-office",
              },
              {
                id: "legal",
                name: "Legal",
                type: "Wing / Cost Centers",
                code: "W-LEG",
                status: "Active",
                parentId: "head-office",
              },
            ],
          },
          {
            id: "ops",
            name: "Operations Wing",
            type: "Operations",
            code: "OPS-01",
            status: "Active",
            parentId: "plra",
            children: [
              {
                id: "north-region",
                name: "North Region",
                type: "Region / Division",
                code: "REG-N",
                status: "Active",
                parentId: "ops",
                children: [
                  {
                    id: "district-1",
                    name: "District 1 (Dn)",
                    type: "District",
                    code: "DIST-1",
                    status: "Active",
                    parentId: "north-region",
                    children: [
                      {
                        id: "tehsil-1",
                        name: "Tehsil 1 (Tn)",
                        type: "Tehsil",
                        code: "TEH-1",
                        status: "Active",
                        parentId: "district-1",
                        children: [
                          {
                            id: "arc",
                            name: "ARC",
                            type: "Field Service",
                            code: "FS-ARC",
                            status: "Active",
                            parentId: "tehsil-1",
                          },
                          {
                            id: "field-offices",
                            name: "Field Offices",
                            type: "Field Service",
                            code: "FS-FO",
                            status: "Active",
                            parentId: "tehsil-1",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function TenantCreationWizard() {
  const router = useRouter();


  const [activeStep, setActiveStep] = useState(0); // Starts at Step 0: Organization Basics

  // Step 0: Organization Basics State
  const [organization, setOrganization] = useState<OrganizationBasicsData>({
    legalName: "",
    slug: "",
    ntn: "",
    address: "",
    country: "",
    financialYear: "",
    currency: "",
    language: "",
  });

  // Step 1: Business Unit State
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [unitError, setUnitError] = useState<string>("");
  const [otherUnitDetails, setOtherUnitDetails] = useState<BusinessUnitDetails>({
    name: "",
    code: "",
    description: "",
  });

  // Step 2: Org Hierarchy Tree State (starts empty matching image 1 top half)
  const [treeData, setTreeData] = useState<HierarchyTreeNode[]>([]);

  // Step 3: Plan & Modules State (empty by default)
  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});

  const [selectedSubModules, setSelectedSubModules] = useState<Record<string, boolean>>({});

  // Step 4: First Admin User State
  const [adminUser, setAdminUser] = useState<AdminUserData>({
    fullName: "",
    email: "",
    role: "Tenant Administrator",
  });

  // Step 5: Branding State
  const [branding, setBranding] = useState<BrandingData>({
    primaryColor: "#0a1128",
    logoFileName: "",
    logoUrl: "",
  });

  // ============================================================================
  // TANSTACK QUERY PLACEHOLDERS
  // ============================================================================
  const createTenantMutation = useCreateTenantMutation();
  // Optional Query Placeholders:
  // const { data: catalogModules } = useModulesQuery();
  // const { data: buTemplates } = useBusinessUnitsQuery();
  // const { data: serverHierarchy } = useOrgHierarchyQuery();

  // Navigation handlers
  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, 6));
  const handlePrev = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // Step 0 Handlers
  function handleOrganizationChange(field: keyof OrganizationBasicsData, value: string) {
    setOrganization((prev) => ({ ...prev, [field]: value }));
  }

  // Step 1 Handlers
  function handleSelectUnit(unit: string) {
    setSelectedUnit(unit);
    setUnitError("");
  }

  // Step 2 Handlers (Org Hierarchy)
  function handleSaveHierarchyNode(newNode: HierarchyTreeNode) {
    setTreeData((prev) => {
      function removeExisting(nodes: HierarchyTreeNode[]): HierarchyTreeNode[] {
        return nodes
          .filter((n) => n.id !== newNode.id)
          .map((n) => ({
            ...n,
            children: n.children ? removeExisting(n.children) : [],
          }));
      }

      const cleaned = removeExisting(prev);

      if (!newNode.parentId) {
        return [...cleaned, newNode];
      }

      function insertUnderParent(nodes: HierarchyTreeNode[]): HierarchyTreeNode[] {
        return nodes.map((n) => {
          if (n.id === newNode.parentId) {
            return { ...n, children: [...(n.children || []), newNode] };
          }
          if (n.children && n.children.length > 0) {
            return { ...n, children: insertUnderParent(n.children) };
          }
          return n;
        });
      }

      return insertUnderParent(cleaned);
    });
  }

  function handleDeleteHierarchyNode(nodeId: string) {
    setTreeData((prev) => {
      function remove(nodes: HierarchyTreeNode[]): HierarchyTreeNode[] {
        return nodes
          .filter((n) => n.id !== nodeId)
          .map((n) => ({ ...n, children: n.children ? remove(n.children) : [] }));
      }
      return remove(prev);
    });
  }

  // Step 3 Handlers (Plan & Modules)
  function handleToggleModule(moduleId: string) {
    setSelectedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  }

  function handleToggleSubModule(subModuleId: string) {
    setSelectedSubModules((prev) => ({
      ...prev,
      [subModuleId]: !prev[subModuleId],
    }));
  }

  // Step 4 Handlers (Admin)
  function handleAdminChange(field: keyof AdminUserData, value: string) {
    setAdminUser((prev) => ({ ...prev, [field]: value }));
  }

  // Step 5 Handlers (Branding)
  function handleBrandingChange(field: keyof BrandingData, value: string) {
    setBranding((prev) => ({ ...prev, [field]: value }));
  }

  // Step 6 Final Submission
  function handleFinalSubmit() {
    const fullPayload: TenantCreationPayload = {
      organization,
      businessUnit: {
        type: selectedUnit,
        details: selectedUnit === "Other" ? otherUnitDetails : undefined,
      },
      hierarchy: treeData,
      plan: "Growth",
      modules: Object.entries(selectedModules)
        .filter(([, enabled]) => enabled)
        .map(([id]) => ({
          moduleId: id,
          moduleName: id.toUpperCase(),
          enabledSubModules: Object.keys(selectedSubModules).filter(
            (subId) => subId.startsWith(id) && selectedSubModules[subId]
          ),
        })),
      adminUser,
      branding,
    };

    // [TanStack Query Placeholder]
    createTenantMutation.mutate(fullPayload);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Tenant Directory", href: "/tenants" },
            { label: "Create Tenant" },
          ]}
        />
      </div>

      {/* 7-Step Dynamic Stepper */}
      <WizardStepper activeStep={activeStep} onStepClick={(idx) => setActiveStep(idx)} />

      {/* Sequential Step Screens */}
      {activeStep === 0 && (
        <StepOrganizationBasics
          data={organization}
          onChange={handleOrganizationChange}
          onCancel={() => router.push("/tenants")}
          onContinue={handleNext}
        />
      )}

      {activeStep === 1 && (
        <StepBusinessUnit
          selectedUnit={selectedUnit}
          unitError={unitError}
          otherDetails={otherUnitDetails}
          onSelectUnit={handleSelectUnit}
          onOtherDetailsChange={setOtherUnitDetails}
          onBack={handlePrev}
          onContinue={handleNext}
        />
      )}

      {activeStep === 2 && (
        <StepOrgHierarchy
          treeData={treeData}
          onSaveNode={handleSaveHierarchyNode}
          onDeleteNode={handleDeleteHierarchyNode}
          onBack={handlePrev}
          onSkip={handleNext}
          onContinue={handleNext}
        />
      )}

      {activeStep === 3 && (
        <StepPlanModules
          selectedModules={selectedModules}
          selectedSubModules={selectedSubModules}
          onToggleModule={handleToggleModule}
          onToggleSubModule={handleToggleSubModule}
          onBack={handlePrev}
          onContinue={handleNext}
        />
      )}

      {activeStep === 4 && (
        <StepAdminUser
          adminData={adminUser}
          onChange={handleAdminChange}
          onBack={handlePrev}
          onContinue={handleNext}
        />
      )}

      {activeStep === 5 && (
        <StepBranding
          brandingData={branding}
          organizationName={organization.legalName}
          onChange={handleBrandingChange}
          onBack={handlePrev}
          onContinue={handleNext}
        />
      )}

      {activeStep === 6 && (
        <StepReviewCreate
          payload={{
            organization,
            businessUnit: {
              type: selectedUnit,
              details: selectedUnit === "Other" ? otherUnitDetails : undefined,
            },
            hierarchy: treeData,
            plan: "Growth",
            modules: Object.entries(selectedModules)
              .filter(([, enabled]) => enabled)
              .map(([id]) => ({
                moduleId: id,
                moduleName: id.toUpperCase(),
                enabledSubModules: Object.keys(selectedSubModules).filter(
                  (subId) => subId.startsWith(id) && selectedSubModules[subId]
                ),
              })),
            adminUser,
            branding,
          }}
          isSubmitting={createTenantMutation.isPending}
          onBack={handlePrev}
          onSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
}
