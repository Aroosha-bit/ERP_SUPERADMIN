"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { WizardStepper } from "./wizard-stepper";
import { StepOrganizationBasics } from "./components/step-organization-basics";
import { StepBusinessUnit } from "./components/step-business-unit";
import { StepOrgHierarchy } from "./components/step-org-hierarchy";
import { StepPlanModules } from "./components/step-plan-modules";
import { StepAdminUser } from "./components/step-admin-user";
import { StepBranding } from "./components/step-branding";
import { StepReviewCreate } from "./components/step-review-create";

import type {
  HierarchyTreeNode,
  TenantCreationPayload,
} from "@/types/tenant-creation";
import {
  useBusinessUnits,
  useCreateTenantMutation,
  useModuleCatalog,
  useTenantForEdit,
  useUpdateTenantMutation,
} from "@/hooks/tenants/use-tenants";
import type { RootState, AppDispatch } from "@/store/store";
import {
  defaultTenantWizardData,
  initializeTenantWizard,
  resetTenantWizard,
  setTenantWizardHierarchy,
  updateTenantWizardStep,
} from "@/store/tenant-wizard-slice";
import type {
  AdminUserValues,
  BrandingValues,
  BusinessUnitValues,
  OrganizationBasicsValues,
  PlanModulesValues,
} from "@/lib/schemas/tenant";

import PageContainer from "@/components/common/page-container/PageContainer";
import { TenantWizardSkeleton } from "@/components/common/loading-skeletons";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_PATHS = [
  "/tenants/create-tenant/organization-basics",
  "/tenants/create-tenant/business-unit",
  "/tenants/create-tenant/org-hierarchy",
  "/tenants/create-tenant/plan-modules",
  "/tenants/create-tenant/admin-user",
  "/tenants/create-tenant/branding",
  "/tenants/create-tenant/review-create",
];

// ─── Wizard ───────────────────────────────────────────────────────────────────

function toWizardData(payload: TenantCreationPayload) {
  return {
    organization: payload.organization,
    businessUnit: {
      selectedUnit: payload.businessUnit.type,
      unitName: payload.businessUnit.details?.name ?? "",
      unitCode: payload.businessUnit.details?.code ?? "",
      unitDescription: payload.businessUnit.details?.description ?? "",
    },
    planModules: {
      plan: payload.plan,
      selectedModules: payload.modules.map((module) => module.moduleId),
      selectedSubModules: payload.modules.flatMap(
        (module) => module.enabledSubModules,
      ),
    },
    adminUser: payload.adminUser,
    branding: {
      primaryColor: payload.branding.primaryColor,
      logoFileName: payload.branding.logoFileName ?? "",
      logoUrl: payload.branding.logoUrl ?? "",
    },
    treeData: payload.hierarchy,
  };
}

export default function TenantCreationWizard({
  stepIndex,
  tenantId,
  startNew = false,
}: {
  stepIndex: number;
  tenantId?: string;
  startNew?: boolean;
}) {
  const router = useRouter();
  const activeStep = stepIndex;
  const dispatch = useDispatch<AppDispatch>();
  const wizard = useSelector((state: RootState) => state.tenantWizard);
  const wizardData = wizard.data;
  const treeData = wizardData.treeData;
  const completedSteps = wizard.completedSteps;
  const tenantEditQuery = useTenantForEdit(tenantId ?? "");
  const createTenantMutation = useCreateTenantMutation();
  const updateTenantMutation = useUpdateTenantMutation();
  const businessUnitsQuery = useBusinessUnits(activeStep === 1);
  const moduleCatalogQuery = useModuleCatalog(
    activeStep === 3 || activeStep === 6,
  );

  // New flow state stays in Redux while the user navigates the wizard routes.
  useEffect(() => {
    if (tenantId) {
      if (wizard.initialized && wizard.tenantId === tenantId) return;
      if (!tenantEditQuery.data) return;
      dispatch(
        initializeTenantWizard({
          tenantId,
          data: toWizardData(tenantEditQuery.data.payload),
          completedSteps: [0, 1, 2, 3, 4, 5],
        }),
      );
      return;
    }
    if (startNew && activeStep === 0) {
      if (wizard.initialized && wizard.tenantId === null) {
        dispatch(resetTenantWizard());
      }
      dispatch(
        initializeTenantWizard({
          tenantId: null,
          data: defaultTenantWizardData,
          completedSteps: [],
        }),
      );
      return;
    }
    if (!wizard.initialized || wizard.tenantId !== null) {
      dispatch(
        initializeTenantWizard({
          tenantId: null,
          data: defaultTenantWizardData,
          completedSteps: [],
        }),
      );
    }
  }, [
    activeStep,
    dispatch,
    startNew,
    tenantEditQuery.data,
    tenantId,
    wizard.initialized,
    wizard.tenantId,
  ]);

  const stateReady = tenantId
    ? wizard.initialized && wizard.tenantId === tenantId && Boolean(tenantEditQuery.data)
    : wizard.initialized && wizard.tenantId === null;
  const stepUrl = (index: number) =>
    `${STEP_PATHS[index]}${tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : ""}`;

  // ── Redirect forward-jumpers ─────────────────────────────────────────────────
  const firstIncompleteStep = STEP_PATHS.findIndex(
    (_, i) => i < STEP_PATHS.length - 1 && !completedSteps.includes(i),
  );
  const firstAvailableStep = firstIncompleteStep === -1 ? STEP_PATHS.length - 1 : firstIncompleteStep;

  useEffect(() => {
    if (stateReady && activeStep > firstAvailableStep) {
      router.replace(
        `${STEP_PATHS[firstAvailableStep]}${tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : ""}`,
      );
    }
  }, [activeStep, firstAvailableStep, router, stateReady, tenantId]);

  // ── Generic step-complete helper ─────────────────────────────────────────────
  function advance(nextData: Partial<typeof wizardData>) {
    dispatch(
      updateTenantWizardStep({
        activeStep,
        data: nextData,
      }),
    );
    router.push(stepUrl(activeStep + 1));
  }

  function goBack() {
    router.push(stepUrl(Math.max(activeStep - 1, 0)));
  }

  function handleCancel() {
    dispatch(resetTenantWizard());
    router.push("/tenants");
  }

  // ── Hierarchy handlers (no react-hook-form needed here) ──────────────────────
  function handleSaveHierarchyNode(newNode: HierarchyTreeNode) {
    function removeExisting(nodes: HierarchyTreeNode[]): HierarchyTreeNode[] {
      return nodes
        .filter((node) => node.id !== newNode.id)
        .map((node) => ({
          ...node,
          children: node.children ? removeExisting(node.children) : [],
        }));
    }
    const cleaned = removeExisting(treeData);
    if (!newNode.parentId) {
      dispatch(setTenantWizardHierarchy([...cleaned, newNode]));
      return;
    }
    function insertUnderParent(nodes: HierarchyTreeNode[]): HierarchyTreeNode[] {
      return nodes.map((node) => {
        if (node.id === newNode.parentId) {
          return { ...node, children: [...(node.children ?? []), newNode] };
        }
        if (node.children?.length) {
          return { ...node, children: insertUnderParent(node.children) };
        }
        return node;
      });
    }
    dispatch(setTenantWizardHierarchy(insertUnderParent(cleaned)));
  }

  function handleDeleteHierarchyNode(nodeId: string) {
    function remove(nodes: HierarchyTreeNode[]): HierarchyTreeNode[] {
      return nodes
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          children: node.children ? remove(node.children) : [],
        }));
    }
    dispatch(setTenantWizardHierarchy(remove(treeData)));
  }

  // ── Final submission ─────────────────────────────────────────────────────────
  function buildPayload(): TenantCreationPayload {
    const d = wizardData;
    return {
      organization: {
        legalName:     d.organization.legalName,
        slug:          d.organization.slug,
        ntn:           d.organization.ntn,
        address:       d.organization.address,
        country:       d.organization.country,
        financialYear: d.organization.financialYear,
        currency:      d.organization.currency,
        language:      d.organization.language,
      },
      businessUnit: {
        type: d.businessUnit.selectedUnit,
        details: d.businessUnit.selectedUnit === "Other"
          ? { name: d.businessUnit.unitName ?? "", code: d.businessUnit.unitCode ?? "", description: d.businessUnit.unitDescription ?? "" }
          : undefined,
      },
      hierarchy: treeData,
      plan: d.planModules.plan,
      totalModules: moduleCatalogQuery.data?.length ?? 0,
      modules: d.planModules.selectedModules.map((id) => ({
        moduleId: id,
        moduleName:
          moduleCatalogQuery.data?.find((module) => module.id === id)?.title ??
          id,
        enabledSubModules:
          moduleCatalogQuery.data
            ?.find((module) => module.id === id)
            ?.subModules.filter((subModule) =>
              d.planModules.selectedSubModules.includes(subModule.id),
            )
            .map((subModule) => subModule.id) ?? [],
      })),
      adminUser: {
        fullName: d.adminUser.fullName,
        email:    d.adminUser.email,
        role:     d.adminUser.role,
      },
      branding: {
        primaryColor:  d.branding.primaryColor,
        logoFileName:  d.branding.logoFileName,
        logoUrl:       d.branding.logoUrl,
      },
    };
  }

  // ── Loading guard ────────────────────────────────────────────────────────────
  if (tenantId && tenantEditQuery.isError) {
    return (
      <PageContainer
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tenant Directory", href: "/tenants" },
          { label: "Edit Tenant" },
        ]}
      >
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {tenantEditQuery.error.message}
        </p>
      </PageContainer>
    );
  }

  if (!stateReady || activeStep > firstAvailableStep) {
    return (
      <PageContainer
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tenant Directory", href: "/tenants" },
          { label: tenantId ? "Edit Tenant" : "Create Tenant" },
        ]}
      >
        <TenantWizardSkeleton />
      </PageContainer>
    );
  }

  const needsModuleCatalog = activeStep === 3 || activeStep === 6;
  if (
    (activeStep === 1 && businessUnitsQuery.isLoading) ||
    (needsModuleCatalog && moduleCatalogQuery.isLoading)
  ) {
    return (
      <PageContainer
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tenant Directory", href: "/tenants" },
          { label: "Create Tenant" },
        ]}
      >
        <TenantWizardSkeleton />
      </PageContainer>
    );
  }

  if (
    (activeStep === 1 && businessUnitsQuery.isError) ||
    (activeStep === 3 && moduleCatalogQuery.isError)
  ) {
    const error =
      activeStep === 1 ? businessUnitsQuery.error : moduleCatalogQuery.error;
    return (
      <PageContainer
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tenant Directory", href: "/tenants" },
          { label: tenantId ? "Edit Tenant" : "Create Tenant" },
        ]}
      >
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error?.message ?? "Could not load tenant setup options."}
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Tenant Directory", href: "/tenants" },
        { label: tenantId ? "Edit Tenant" : "Create Tenant" },
      ]}
    >
      <WizardStepper activeStep={activeStep} completedSteps={completedSteps} />

      {/* ── Step 0: Organization Basics ─────────────────────────────────────── */}
      {activeStep === 0 && (
        <StepOrganizationBasics
          defaultValues={wizardData.organization}
          onSubmit={(data: OrganizationBasicsValues) => advance({ organization: data })}
          onCancel={handleCancel}
        />
      )}

      {/* ── Step 1: Business Unit ────────────────────────────────────────────── */}
      {activeStep === 1 && (
        <StepBusinessUnit
          businessUnits={businessUnitsQuery.data ?? []}
          defaultValues={wizardData.businessUnit}
          onSubmit={(data: BusinessUnitValues) => advance({ businessUnit: data })}
          onBack={goBack}
        />
      )}

      {/* ── Step 2: Org Hierarchy (interactive, no form) ─────────────────────── */}
      {activeStep === 2 && (
        <StepOrgHierarchy
          treeData={treeData}
          onSaveNode={handleSaveHierarchyNode}
          onDeleteNode={handleDeleteHierarchyNode}
          onBack={goBack}
          onSkip={() => advance({})}
          onContinue={() => advance({})}
        />
      )}

      {/* ── Step 3: Plan & Modules ───────────────────────────────────────────── */}
      {activeStep === 3 && (
        <StepPlanModules
          modules={moduleCatalogQuery.data ?? []}
          defaultValues={wizardData.planModules}
          onSubmit={(data: PlanModulesValues) => advance({ planModules: data })}
          onBack={goBack}
        />
      )}

      {/* ── Step 4: Admin User ───────────────────────────────────────────────── */}
      {activeStep === 4 && (
        <StepAdminUser
          defaultValues={wizardData.adminUser}
          onSubmit={(data: AdminUserValues) => advance({ adminUser: data })}
          onBack={goBack}
        />
      )}

      {/* ── Step 5: Branding ─────────────────────────────────────────────────── */}
      {activeStep === 5 && (
        <StepBranding
          defaultValues={wizardData.branding}
          organizationName={wizardData.organization.legalName}
          onSubmit={(data: BrandingValues) => advance({ branding: data })}
          onBack={goBack}
        />
      )}

      {/* ── Step 6: Review & Create ──────────────────────────────────────────── */}
      {activeStep === 6 && (
        <StepReviewCreate
          payload={buildPayload()}
          isEditing={Boolean(tenantId)}
          isSubmitting={
            createTenantMutation.isPending || updateTenantMutation.isPending
          }
          error={
            createTenantMutation.error?.message ??
            updateTenantMutation.error?.message
          }
          onBack={goBack}
          handleSubmit={() => {
            const payload = buildPayload();
            if (tenantId) {
              updateTenantMutation.mutate(
                { tenantId, payload },
                {
                  onSuccess: (tenant) => {
                    dispatch(resetTenantWizard());
                    router.push(`/tenants/${tenant.id}`);
                  },
                },
              );
              return;
            }
            createTenantMutation.mutate(payload, {
              onSuccess: (tenant) => {
                dispatch(resetTenantWizard());
                router.push(`/tenants/success?tenantId=${tenant.id}`);
              },
            });
          }}
        />
      )}
    </PageContainer>
  );
}
