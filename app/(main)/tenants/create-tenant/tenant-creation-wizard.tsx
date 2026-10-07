"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { WizardStepper } from "./wizard-stepper";
import { StepOrganizationBasics } from "./components/step-organization-basics";
import { StepBusinessUnit } from "./components/step-business-unit";
import { StepOrgHierarchy } from "./components/step-org-hierarchy";
import { StepPlanModules } from "./components/step-plan-modules";
import { StepAdminUser } from "./components/step-admin-user";
import { StepBranding } from "./components/step-branding";
import { StepReviewCreate } from "./components/step-review-create";

import {
  useCreateTenantMutation,
  type OrganizationBasicsData,
  type BusinessUnitDetails,
  type HierarchyTreeNode,
  type AdminUserData,
  type BrandingData,
  type TenantCreationPayload,
} from "@/hooks/tenants/use-tenant-wizard";

import PageContainer from "@/components/common/page-container/PageContainer";

// ============================================================================
// TYPES
// ============================================================================

type ValidationErrors = Record<string, string>;

const STEP_PATHS = [
  "/tenants/create-tenant/organization-basics",
  "/tenants/create-tenant/business-unit",
  "/tenants/create-tenant/org-hierarchy",
  "/tenants/create-tenant/plan-modules",
  "/tenants/create-tenant/admin-user",
  "/tenants/create-tenant/branding",
  "/tenants/create-tenant/review-create",
];

const WIZARD_STORAGE_KEY = "tenant-creation-wizard";

interface SavedWizardState {
  organization: OrganizationBasicsData;
  selectedUnit: string;
  otherUnitDetails: BusinessUnitDetails;
  treeData: HierarchyTreeNode[];
  selectedModules: Record<string, boolean>;
  selectedSubModules: Record<string, boolean>;
  adminUser: AdminUserData;
  branding: BrandingData;
  completedSteps: number[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStringFields(
  value: unknown,
  fields: string[],
): value is Record<string, string> {
  return (
    isRecord(value) &&
    fields.every((field) => typeof value[field] === "string")
  );
}

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return (
    isRecord(value) &&
    Object.values(value).every((item) => typeof item === "boolean")
  );
}

function isSavedWizardState(value: unknown): value is SavedWizardState {
  if (!isRecord(value)) {
    return false;
  }

  return (
    hasStringFields(value.organization, [
      "legalName",
      "slug",
      "ntn",
      "address",
      "country",
      "financialYear",
      "currency",
      "language",
    ]) &&
    typeof value.selectedUnit === "string" &&
    hasStringFields(value.otherUnitDetails, ["name", "code", "description"]) &&
    Array.isArray(value.treeData) &&
    isBooleanRecord(value.selectedModules) &&
    isBooleanRecord(value.selectedSubModules) &&
    hasStringFields(value.adminUser, ["fullName", "email", "role"]) &&
    hasStringFields(value.branding, ["primaryColor"]) &&
    (value.branding.logoFileName === undefined ||
      typeof value.branding.logoFileName === "string") &&
    (value.branding.logoUrl === undefined ||
      typeof value.branding.logoUrl === "string") &&
    Array.isArray(value.completedSteps) &&
    value.completedSteps.every(
      (step) => Number.isInteger(step) && step >= 0 && step < STEP_PATHS.length - 1,
    )
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TenantCreationWizard({
  stepIndex,
}: {
  stepIndex: number;
}) {
  const router = useRouter();

  // ==========================================================================
  // WIZARD STATE
  // ==========================================================================

  const activeStep = stepIndex;
  const [isHydrated, setIsHydrated] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Validation errors for current/all steps
  const [errors, setErrors] = useState<ValidationErrors>({});

  // ==========================================================================
  // STEP 0: ORGANIZATION BASICS
  // ==========================================================================

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

  // ==========================================================================
  // STEP 1: BUSINESS UNIT
  // ==========================================================================

  const [selectedUnit, setSelectedUnit] = useState<string>("");

  const [otherUnitDetails, setOtherUnitDetails] = useState<BusinessUnitDetails>(
    {
      name: "",
      code: "",
      description: "",
    },
  );

  // ==========================================================================
  // STEP 2: ORGANIZATION HIERARCHY
  // ==========================================================================

  const [treeData, setTreeData] = useState<HierarchyTreeNode[]>([]);

  // ==========================================================================
  // STEP 3: PLAN & MODULES
  // ==========================================================================

  const [selectedModules, setSelectedModules] = useState<
    Record<string, boolean>
  >({});

  const [selectedSubModules, setSelectedSubModules] = useState<
    Record<string, boolean>
  >({});

  // ==========================================================================
  // STEP 4: ADMIN USER
  // ==========================================================================

  const [adminUser, setAdminUser] = useState<AdminUserData>({
    fullName: "",
    email: "",
    role: "Tenant Administrator",
  });

  // ==========================================================================
  // STEP 5: BRANDING
  // ==========================================================================

  const [branding, setBranding] = useState<BrandingData>({
    primaryColor: "#0a1128",
    logoFileName: "",
    logoUrl: "",
  });

  // ==========================================================================
  // TANSTACK QUERY PLACEHOLDERS
  // ==========================================================================

  const createTenantMutation = useCreateTenantMutation();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedState = sessionStorage.getItem(WIZARD_STORAGE_KEY);

      if (storedState) {
        try {
          const parsedState: unknown = JSON.parse(storedState);
          if (isSavedWizardState(parsedState)) {
            setOrganization(parsedState.organization);
            setSelectedUnit(parsedState.selectedUnit);
            setOtherUnitDetails(parsedState.otherUnitDetails);
            setTreeData(parsedState.treeData);
            setSelectedModules(parsedState.selectedModules);
            setSelectedSubModules(parsedState.selectedSubModules);
            setAdminUser(parsedState.adminUser);
            setBranding({
              ...parsedState.branding,
              logoUrl: parsedState.branding.logoUrl?.startsWith("blob:")
                ? ""
                : parsedState.branding.logoUrl,
            });
            setCompletedSteps(parsedState.completedSteps);
          } else {
            console.error("Stored tenant creation progress is invalid.");
            sessionStorage.removeItem(WIZARD_STORAGE_KEY);
          }
        } catch (error) {
          console.error("Could not restore tenant creation progress.", error);
          sessionStorage.removeItem(WIZARD_STORAGE_KEY);
        }
      }

      setIsHydrated(true);
    });

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const savedState: SavedWizardState = {
      organization,
      selectedUnit,
      otherUnitDetails,
      treeData,
      selectedModules,
      selectedSubModules,
      adminUser,
      branding,
      completedSteps,
    };

    sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(savedState));
  }, [
    adminUser,
    branding,
    completedSteps,
    isHydrated,
    organization,
    otherUnitDetails,
    selectedModules,
    selectedSubModules,
    selectedUnit,
    treeData,
  ]);

  const firstIncompleteStep = STEP_PATHS.findIndex(
    (_, index) =>
      index < STEP_PATHS.length - 1 && !completedSteps.includes(index),
  );
  const firstAvailableStep =
    firstIncompleteStep === -1 ? STEP_PATHS.length - 1 : firstIncompleteStep;

  useEffect(() => {
    if (isHydrated && activeStep > firstAvailableStep) {
      router.replace(STEP_PATHS[firstAvailableStep]);
    }
  }, [activeStep, firstAvailableStep, isHydrated, router]);

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  function validateStep(step: number): boolean {
    const newErrors: ValidationErrors = {};

    // ------------------------------------------------------------------------
    // STEP 0: ORGANIZATION BASICS
    // ------------------------------------------------------------------------

    if (step === 0) {
      if (!organization.legalName.trim()) {
        newErrors.legalName = "Enter Legal Entity Name.";
      }

      if (!organization.slug.trim()) {
        newErrors.slug = "Enter Official Code / Slug.";
      }

      if (!organization.ntn.trim()) {
        newErrors.ntn = "Enter NTN.";
      }

      if (!organization.address.trim()) {
        newErrors.address = "Select Address.";
      }

      if (!organization.country.trim()) {
        newErrors.country = "Select Country / Region.";
      }

      if (!organization.financialYear.trim()) {
        newErrors.financialYear = "Select Financial-Year Start.";
      }

      if (!organization.currency.trim()) {
        newErrors.currency = "Select Base Currency.";
      }

      if (!organization.language.trim()) {
        newErrors.language = "Select Default Language.";
      }
    }

    // ------------------------------------------------------------------------
    // STEP 1: BUSINESS UNIT
    // ------------------------------------------------------------------------

    if (step === 1) {
      if (!selectedUnit) {
        newErrors.businessUnit = "Select a Business Unit.";
      }

      // If user selects Other, additional fields become required.
      if (selectedUnit === "Other") {
        if (!otherUnitDetails.name.trim()) {
          newErrors.unitName = "Enter Business Unit Name.";
        }

        if (!otherUnitDetails.code.trim()) {
          newErrors.unitCode = "Enter Official Code / Slug.";
        }
      }
    }

    // ------------------------------------------------------------------------
    // STEP 2: ORGANIZATION HIERARCHY
    // ------------------------------------------------------------------------

    /*
     * This step is currently optional because the existing UI
     * provides an "onSkip" handler.
     *
     * If the business requirement later makes hierarchy mandatory,
     * validation can be added here.
     */

    if (step === 2) {
      // Optional step - no validation for now.
    }

    // ------------------------------------------------------------------------
    // STEP 3: PLAN & MODULES
    // ------------------------------------------------------------------------

    if (step === 3) {
      const hasSelectedModule = Object.values(selectedModules).some(Boolean);

      if (!hasSelectedModule) {
        newErrors.modules = "Select at least one module.";
      }
    }

    // ------------------------------------------------------------------------
    // STEP 4: ADMIN USER
    // ------------------------------------------------------------------------

    if (step === 4) {
      if (!adminUser.fullName.trim()) {
        newErrors.fullName = "Enter Full Name.";
      }

      if (!adminUser.email.trim()) {
        newErrors.email = "Enter Email.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminUser.email)) {
        newErrors.email = "Enter a valid Email address.";
      }
    }

    // ------------------------------------------------------------------------
    // STEP 5: BRANDING
    // ------------------------------------------------------------------------

    /*
     * Branding is currently optional.
     *
     * Add validation here later if the backend requires
     * logo/color/etc.
     */

    if (step === 5) {
      // Optional for now.
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // ==========================================================================
  // NAVIGATION
  // ==========================================================================

  function persistProgress(nextCompletedSteps: number[]) {
    const savedState: SavedWizardState = {
      organization,
      selectedUnit,
      otherUnitDetails,
      treeData,
      selectedModules,
      selectedSubModules,
      adminUser,
      branding,
      completedSteps: nextCompletedSteps,
    };

    sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(savedState));
  }

  function handleNext() {
    const isValid = validateStep(activeStep);

    if (!isValid) {
      return;
    }

    setErrors({});
    const nextCompletedSteps = [
      ...completedSteps.filter((completedStep) => completedStep < activeStep),
      activeStep,
    ];
    persistProgress(nextCompletedSteps);
    setCompletedSteps(nextCompletedSteps);
    router.push(STEP_PATHS[activeStep + 1]);
  }

  function handlePrev() {
    setErrors({});
    router.push(STEP_PATHS[Math.max(activeStep - 1, 0)]);
  }

  function handleCancel() {
    sessionStorage.removeItem(WIZARD_STORAGE_KEY);
    router.push("/tenants");
  }

  function invalidateStepsFrom(step: number) {
    setCompletedSteps((previous) =>
      previous.filter((completedStep) => completedStep < step),
    );
  }

  // ==========================================================================
  // STEP 0 HANDLERS
  // ==========================================================================

  function handleOrganizationChange(
    field: keyof OrganizationBasicsData,
    value: string,
  ) {
    invalidateStepsFrom(0);
    setOrganization((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Remove error for this field once user starts fixing it.
    setErrors((prev) => {
      const updated = { ...prev };

      delete updated[field];

      return updated;
    });
  }

  // ==========================================================================
  // STEP 1 HANDLERS
  // ==========================================================================

  function handleSelectUnit(unit: string) {
    invalidateStepsFrom(1);
    setSelectedUnit(unit);

    setErrors((prev) => {
      const updated = { ...prev };

      delete updated.businessUnit;

      return updated;
    });
  }

  function handleOtherUnitDetailsChange(details: BusinessUnitDetails) {
    invalidateStepsFrom(1);
    setOtherUnitDetails(details);

    setErrors((prev) => {
      const updated = { ...prev };

      delete updated.unitName;
      delete updated.unitCode;

      return updated;
    });
  }

  // ==========================================================================
  // STEP 2 HANDLERS
  // ==========================================================================

  function handleSaveHierarchyNode(newNode: HierarchyTreeNode) {
    invalidateStepsFrom(2);
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

      function insertUnderParent(
        nodes: HierarchyTreeNode[],
      ): HierarchyTreeNode[] {
        return nodes.map((n) => {
          if (n.id === newNode.parentId) {
            return {
              ...n,
              children: [...(n.children || []), newNode],
            };
          }

          if (n.children && n.children.length > 0) {
            return {
              ...n,
              children: insertUnderParent(n.children),
            };
          }

          return n;
        });
      }

      return insertUnderParent(cleaned);
    });
  }

  function handleDeleteHierarchyNode(nodeId: string) {
    invalidateStepsFrom(2);
    setTreeData((prev) => {
      function remove(nodes: HierarchyTreeNode[]): HierarchyTreeNode[] {
        return nodes
          .filter((n) => n.id !== nodeId)
          .map((n) => ({
            ...n,
            children: n.children ? remove(n.children) : [],
          }));
      }

      return remove(prev);
    });
  }

  // ==========================================================================
  // STEP 3 HANDLERS
  // ==========================================================================

  function handleToggleModule(moduleId: string) {
    invalidateStepsFrom(3);
    setSelectedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));

    // Clear module validation error.
    setErrors((prev) => {
      const updated = { ...prev };

      delete updated.modules;

      return updated;
    });
  }

  function handleToggleSubModule(subModuleId: string) {
    invalidateStepsFrom(3);
    setSelectedSubModules((prev) => ({
      ...prev,
      [subModuleId]: !prev[subModuleId],
    }));
  }

  // ==========================================================================
  // STEP 4 HANDLERS
  // ==========================================================================

  function handleAdminChange(field: keyof AdminUserData, value: string) {
    invalidateStepsFrom(4);
    setAdminUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const updated = { ...prev };

      delete updated[field];

      return updated;
    });
  }

  // ==========================================================================
  // STEP 5 HANDLERS
  // ==========================================================================

  function handleBrandingChange(field: keyof BrandingData, value: string) {
    invalidateStepsFrom(5);
    setBranding((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const updated = { ...prev };

      delete updated[field];

      return updated;
    });
  }

  // ==========================================================================
  // BUILD TENANT PAYLOAD
  // ==========================================================================

  function buildTenantPayload(): TenantCreationPayload {
    return {
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
            (subId) => subId.startsWith(id) && selectedSubModules[subId],
          ),
        })),

      adminUser,

      branding,
    };
  }

  // ==========================================================================
  // FINAL SUBMISSION
  // ==========================================================================

  function handleFinalSubmit() {
    /*
     * Before submitting, validate all required steps.
     *
     * This protects us even if the user somehow reaches
     * the Review/Create screen without completing a step.
     */

    for (let step = 0; step <= 5; step++) {
      const isValid = validateStep(step);

      if (!isValid) {
        setCompletedSteps((previous) =>
          previous.filter((completedStep) => completedStep < step),
        );
        router.replace(STEP_PATHS[step]);
        return;
      }
    }

    const fullPayload = buildTenantPayload();

    // ============================================================
    // TANSTACK QUERY / API PLACEHOLDER
    // ============================================================

    /*
     * Later this mutation will call your backend API.
     *
     * Example future flow:
     *
     * createTenantMutation.mutate(fullPayload, {
     *   onSuccess: () => {
     *     router.push("/tenants");
     *   },
     *   onError: (error) => {
     *     // Show API error
     *   },
     * });
     */

    createTenantMutation.mutate(fullPayload);
  }

  // ==========================================================================
  // UI
  // ==========================================================================

  if (!isHydrated || activeStep > firstAvailableStep) {
    return (
      <PageContainer
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tenant Directory", href: "/tenants" },
          { label: "Create Tenant" },
        ]}
      >
        <p role="status" className="text-sm text-[#4b5568]">
          Loading tenant creation...
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Tenant Directory",
          href: "/tenants",
        },
        {
          label: "Create Tenant",
        },
      ]}
    >
      {/* ================================================================
          7-STEP STEPPER
          ================================================================ */}

      <WizardStepper activeStep={activeStep} completedSteps={completedSteps} />

      {/* ================================================================
          STEP 0: ORGANIZATION BASICS
          ================================================================ */}

      {activeStep === 0 && (
        <StepOrganizationBasics
          data={organization}
          errors={errors}
          onChange={handleOrganizationChange}
          onCancel={handleCancel}
          onContinue={handleNext}
        />
      )}

      {/* ================================================================
          STEP 1: BUSINESS UNIT
          ================================================================ */}

      {activeStep === 1 && (
        <StepBusinessUnit
          selectedUnit={selectedUnit}
          unitError={errors.businessUnit}
          otherDetails={otherUnitDetails}
          errors={errors}
          onSelectUnit={handleSelectUnit}
          onOtherDetailsChange={handleOtherUnitDetailsChange}
          onBack={handlePrev}
          onContinue={handleNext}
        />
      )}

      {/* ================================================================
          STEP 2: ORGANIZATION HIERARCHY
          ================================================================ */}

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

      {/* ================================================================
          STEP 3: PLAN & MODULES
          ================================================================ */}

      {activeStep === 3 && (
        <StepPlanModules
          selectedModules={Object.keys(selectedModules).filter(
            (moduleId) => selectedModules[moduleId],
          )}
          selectedSubModules={Object.keys(selectedSubModules).filter(
            (subModuleId) => selectedSubModules[subModuleId],
          )}
          errors={errors}
          onToggleModule={handleToggleModule}
          onToggleSubModule={handleToggleSubModule}
          onBack={handlePrev}
          onContinue={handleNext}
        />
      )}

      {/* ================================================================
          STEP 4: ADMIN USER
          ================================================================ */}

      {activeStep === 4 && (
        <StepAdminUser
          adminData={adminUser}
          errors={errors}
          onChange={handleAdminChange}
          onBack={handlePrev}
          onContinue={handleNext}
        />
      )}

      {/* ================================================================
          STEP 5: BRANDING
          ================================================================ */}

      {activeStep === 5 && (
        <StepBranding
          brandingData={branding}
          organizationName={organization.legalName}
          errors={errors}
          onChange={handleBrandingChange}
          onBack={handlePrev}
          onContinue={handleNext}
        />
      )}

      {/* ================================================================
          STEP 6: REVIEW & CREATE
          ================================================================ */}

      {activeStep === 6 && (
        <StepReviewCreate
          payload={buildTenantPayload()}
          isSubmitting={createTenantMutation.isPending}
          onBack={handlePrev}
          onSubmit={handleFinalSubmit}
        />
      )}
    </PageContainer>
  );
}
