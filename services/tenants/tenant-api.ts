import { apiFetch } from "@/services/http-client";
import { API_MODE, getApiUrl } from "@/lib/config/api";
import {
  businessUnitOptionsSchema,
  moduleCatalogSchema,
  tenantActivitiesSchema,
  tenantActivitySchema,
  tenantListSchema,
  tenantModuleSchema,
  tenantModulesSchema,
  tenantSchema,
  tenantUserSchema,
  tenantUsersSchema,
} from "@/lib/schemas/api";
import {
  tenantCreationPayloadSchema,
} from "@/lib/schemas/api";
import type {
  BusinessUnitOption,
  ModuleCatalogItem,
  TenantActivityItem,
  TenantDetails,
  TenantModule,
  TenantUser,
} from "@/types/tenant";
import type { TenantCreationPayload } from "@/types/tenant-creation";

async function request<T>(
  path: string,
  schema: { parse: (value: unknown) => T },
  init: RequestInit = {},
): Promise<T> {
  const url = getApiUrl(path);
  const response =
    API_MODE === "backend"
      ? await apiFetch(url, init)
      : await fetch(url, { ...init, cache: "no-store" });

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }
    throw new Error("The API returned an invalid JSON response.");
  }

  if (!response.ok) {
    const message =
      typeof responseBody === "object" &&
      responseBody !== null &&
      "message" in responseBody &&
      typeof responseBody.message === "string"
        ? responseBody.message
        : `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return schema.parse(responseBody);
}

// json requests is a helper, avoid writing method, headers and body every time you make a request. It will automatically set the method, headers and stringify the body for you.

function jsonRequest(method: "POST" | "PUT", body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
// endpoint to get all tenants. which are on main page of localhost/tenants.

export async function getTenants(): Promise<TenantDetails[]> {
  return request("/tenants", tenantListSchema);
}

// to open any specific tenant like when we open plra

export async function getTenant(tenantId: string): Promise<TenantDetails> {
  return request(`/tenants/${encodeURIComponent(tenantId)}`, tenantSchema);
}

// get data for edit tenant
export async function getTenantForEdit(tenantId: string): Promise<{
  tenant: TenantDetails;
  payload: TenantCreationPayload;
}> {
  const tenant = await getTenant(tenantId);
  if (tenant.creationData) {
    return { tenant, payload: tenant.creationData };
  }

  const [modules, users, catalog] = await Promise.all([
    getTenantModules(tenantId),
    getTenantUsers(tenantId),
    getModuleCatalog(),
  ]);
  const admin = users.find((user) => user.isAdmin) ?? users[0];
  const currencyNames: Record<string, string> = {
    PKR: "PKR — Pakistani Rupee",
    USD: "USD — US Dollar",
    AED: "AED — UAE Dirham",
    GBP: "GBP — British Pound",
  };

  return {
    tenant,
    payload: tenantCreationPayloadSchema.parse({
      organization: {
        legalName: tenant.name,
        slug: tenant.slug,
        ntn: tenant.ntn ?? "",
        address: tenant.address ?? tenant.region,
        country: tenant.country ?? tenant.region.split(" — ")[0],
        financialYear: tenant.financialYearStart,
        currency: currencyNames[tenant.baseCurrency] ?? tenant.baseCurrency,
        language: tenant.defaultLanguage,
      },
      businessUnit: {
        type: "Head Office",
      },
      hierarchy: [],
      plan: tenant.plan,
      totalModules: tenant.totalModules,
      modules: modules
        .filter((module) => module.enabled)
        .map((module) => {
          const catalogItem = catalog.find(
            (item) =>
              item.id === module.id ||
              item.title.toLowerCase() === module.name.toLowerCase(),
          );
          return {
            moduleId: catalogItem?.id ?? module.id,
            moduleName: catalogItem?.title ?? module.name,
            enabledSubModules: [],
          };
        }),
      adminUser: {
        fullName: admin?.name ?? tenant.primaryAdmin,
        email: admin?.email ?? tenant.adminEmail,
        role: admin?.role ?? "Tenant Administrator",
      },
      branding: {
        primaryColor: "#0a1128",
        logoFileName: "",
        logoUrl: "",
      },
    }),
  };
}

// post api for creating a new tenant. It will be called when we click on create tenant button in the create tenant wizard.
export async function createTenant(
  payload: TenantCreationPayload,
): Promise<TenantDetails> {
  const today = new Date().toISOString().slice(0, 10);
  const sanitizedPayload = tenantCreationPayloadSchema.parse({
    ...payload,
    branding: {
      ...payload.branding,
      logoUrl: payload.branding.logoUrl?.startsWith("blob:")
        ? ""
        : payload.branding.logoUrl,
    },
  });
  const record = {
    id: crypto.randomUUID(),
    name: sanitizedPayload.organization.legalName,
    slug: sanitizedPayload.organization.slug,
    plan: sanitizedPayload.plan,
    status: "Onboarding" as const, // status by default onboarding
    modulesEnabled: sanitizedPayload.modules.length,
    totalModules: sanitizedPayload.totalModules,
    createdAt: today,
    lastActive: today,
    region: [sanitizedPayload.organization.country, sanitizedPayload.organization.address]
      .filter(Boolean)
      .join(" — "),
    financialYearStart: sanitizedPayload.organization.financialYear,
    baseCurrency: sanitizedPayload.organization.currency.split(" ")[0],
    defaultLanguage: sanitizedPayload.organization.language,
    primaryAdmin: sanitizedPayload.adminUser.fullName,
    adminEmail: sanitizedPayload.adminUser.email,
    ntn: sanitizedPayload.organization.ntn,
    address: sanitizedPayload.organization.address,
    country: sanitizedPayload.organization.country,
    creationData: sanitizedPayload,
  };

  return request(
    "/tenants",
    tenantSchema,
    jsonRequest("POST", record),
  );
}

// update tenant api. It will be called when we click on save changes button in the edit tenant wizard.
export async function updateTenant(
  tenantId: string,
  payload: TenantCreationPayload,
): Promise<TenantDetails> {
  const validatedPayload = tenantCreationPayloadSchema.parse(payload);
  const existingTenant = await getTenant(tenantId);
  const today = new Date().toISOString().slice(0, 10);
  const record = {
    ...existingTenant,
    name: validatedPayload.organization.legalName,
    slug: validatedPayload.organization.slug,
    plan: validatedPayload.plan,
    modulesEnabled: validatedPayload.modules.length,
    totalModules: validatedPayload.totalModules,
    lastActive: today,
    region: [validatedPayload.organization.country, validatedPayload.organization.address]
      .filter(Boolean)
      .join(" — "),
    financialYearStart: validatedPayload.organization.financialYear,
    baseCurrency: validatedPayload.organization.currency.split(" ")[0],
    defaultLanguage: validatedPayload.organization.language,
    primaryAdmin: validatedPayload.adminUser.fullName,
    adminEmail: validatedPayload.adminUser.email,
    ntn: validatedPayload.organization.ntn,
    address: validatedPayload.organization.address,
    country: validatedPayload.organization.country,
    creationData: {
      ...validatedPayload,
      branding: {
        ...validatedPayload.branding,
        logoUrl: validatedPayload.branding.logoUrl?.startsWith("blob:")
          ? ""
          : validatedPayload.branding.logoUrl,
      },
    },
  };
  return request(
    `/tenants/${encodeURIComponent(tenantId)}`,
    tenantSchema,
    jsonRequest("PUT", record),
  );
}

export async function deleteTenant(tenantId: string): Promise<void> {
  const query = new URLSearchParams({ tenantId });
  const [modules, users, activities] = await Promise.all([
    request(`/tenantModules?${query}`, tenantModulesSchema),
    request(`/tenantUsers?${query}`, tenantUsersSchema),
    request(`/tenantActivity?${query}`, tenantActivitiesSchema),
  ]);

  await Promise.all([
    ...modules.map((item) => deleteResource(`/tenantModules/${encodeURIComponent(item.id)}`)),
    ...users.map((item) => deleteResource(`/tenantUsers/${encodeURIComponent(item.id)}`)),
    ...activities.map((item) => deleteResource(`/tenantActivity/${encodeURIComponent(item.id)}`)),
  ]);
  await deleteResource(`/tenants/${encodeURIComponent(tenantId)}`);
}

async function deleteResource(path: string): Promise<void> {
  const url = getApiUrl(path);
  const response =
    API_MODE === "backend"
      ? await apiFetch(url, { method: "DELETE" })
      : await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`Could not delete resource (status ${response.status}).`);
  }
}
// use to get all business units and module catalog. It will be used in the create tenant wizard to show the
//  list of business units and modules.
export async function getBusinessUnits(): Promise<BusinessUnitOption[]> {
  return request("/businessUnits", businessUnitOptionsSchema);
}

// get lists of modules like HR 
export async function getModuleCatalog(): Promise<ModuleCatalogItem[]> {
  return request("/moduleCatalog", moduleCatalogSchema);
}

export async function getTenantModules(
  tenantId: string,
): Promise<TenantModule[]> {
  const query = new URLSearchParams({ tenantId });
  const tenant = await getTenant(tenantId);
  if (!tenant.creationData) {
    return request(`/tenantModules?${query}`, tenantModulesSchema);
  }
  const catalog = await getModuleCatalog();
  const enabledModules = new Map(
    tenant.creationData.modules.map((module) => [module.moduleId, module]),
  );
  return catalog.map((module) => ({
    id: module.id,
    tenantId,
    name: module.title,
    enabled: enabledModules.has(module.id),
  }));
}

export async function updateTenantModule(
  tenantId: string,
  moduleId: string,
  enabled: boolean,
): Promise<TenantModule> {
  const tenant = await getTenant(tenantId);
  if (tenant.creationData) {
    const catalog = await getModuleCatalog();
    const catalogItem = catalog.find((item) => item.id === moduleId);
    if (!catalogItem) throw new Error(`Module "${moduleId}" was not found.`);
    const existing = tenant.creationData.modules.filter(
      (module) => module.moduleId !== moduleId,
    );
    const modules = enabled
      ? [
          ...existing,
          {
            moduleId: catalogItem.id,
            moduleName: catalogItem.title,
            enabledSubModules: [],
          },
        ]
      : existing;
    const updated = await updateTenant(tenantId, {
      ...tenant.creationData,
      modules,
    });
    return {
      id: moduleId,
      tenantId,
      name: catalogItem.title,
      enabled: Boolean(updated.creationData?.modules.some((item) => item.moduleId === moduleId)),
    };
  }

  const query = new URLSearchParams({ tenantId });
  const existing = await request(`/tenantModules?${query}`, tenantModulesSchema);
  const tenantModule =
    existing.find((item) => item.id === moduleId) ??
    existing.find((item) => item.id === `${tenantId}-${moduleId}`);
  if (!tenantModule) throw new Error(`Tenant module "${moduleId}" was not found.`);
  return request(
    `/tenantModules/${encodeURIComponent(tenantModule.id)}`,
    tenantModuleSchema,
    jsonRequest("PUT", { ...tenantModule, enabled }),
  );
}

export async function deleteTenantModule(moduleId: string): Promise<void> {
  await deleteResource(`/tenantModules/${encodeURIComponent(moduleId)}`);
}

export async function getTenantUsers(tenantId: string): Promise<TenantUser[]> {
  const query = new URLSearchParams({ tenantId });
  const tenant = await getTenant(tenantId);
  if (!tenant.creationData) {
    return request(`/tenantUsers?${query}`, tenantUsersSchema);
  }
  const admin = tenant.creationData.adminUser;
  const initials = admin.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return [{
    id: `${tenantId}-admin`,
    tenantId,
    name: admin.fullName,
    initials,
    email: admin.email,
    role: admin.role,
    status: "Active",
    isAdmin: true,
  }];
}

export async function createTenantUser(
  user: Omit<TenantUser, "id">,
): Promise<TenantUser> {
  return request(
    "/tenantUsers",
    tenantUserSchema,
    jsonRequest("POST", { ...user, id: crypto.randomUUID() }),
  );
}

export async function updateTenantUser(
  userId: string,
  updates: Partial<Omit<TenantUser, "id" | "tenantId">>,
): Promise<TenantUser> {
  const existingUser = await request(
    `/tenantUsers/${encodeURIComponent(userId)}`,
    tenantUserSchema,
  );
  return request(
    `/tenantUsers/${encodeURIComponent(userId)}`,
    tenantUserSchema,
    jsonRequest("PUT", {
      ...existingUser,
      ...updates,
    }),
  );
}

export async function deleteTenantUser(userId: string): Promise<void> {
  await deleteResource(`/tenantUsers/${encodeURIComponent(userId)}`);
}

export async function getTenantActivity(
  tenantId: string,
): Promise<TenantActivityItem[]> {
  const query = new URLSearchParams({ tenantId });
  const existing = await request(`/tenantActivity?${query}`, tenantActivitiesSchema);
  if (existing.length > 0) return existing;

  const tenant = await getTenant(tenantId);
  if (!tenant.creationData) return existing;
  return [{
    id: `${tenantId}-created`,
    tenantId,
    date: tenant.createdAt,
    time: "00:00",
    description: `Tenant created on ${tenant.plan} plan.`,
  }];
}

export async function createTenantActivity(
  activity: Omit<TenantActivityItem, "id">,
): Promise<TenantActivityItem> {
  return request(
    "/tenantActivity",
    tenantActivitySchema,
    jsonRequest("POST", { ...activity, id: crypto.randomUUID() }),
  );
}

export async function updateTenantActivity(
  activityId: string,
  updates: Partial<Omit<TenantActivityItem, "id" | "tenantId">>,
): Promise<TenantActivityItem> {
  const existingActivity = await request(
    `/tenantActivity/${encodeURIComponent(activityId)}`,
    tenantActivitySchema,
  );
  return request(
    `/tenantActivity/${encodeURIComponent(activityId)}`,
    tenantActivitySchema,
    jsonRequest("PUT", { ...existingActivity, ...updates }),
  );
}

export async function deleteTenantActivity(activityId: string): Promise<void> {
  await deleteResource(`/tenantActivity/${encodeURIComponent(activityId)}`);
}
