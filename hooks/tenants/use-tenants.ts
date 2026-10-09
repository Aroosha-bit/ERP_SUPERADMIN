"use client";
// this contain all the react-query hooks for tenants, including queries and mutations
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTenant,
  createTenantActivity,
  createTenantUser,
  deleteTenant,
  deleteTenantActivity,
  deleteTenantModule,
  deleteTenantUser,
  getBusinessUnits,
  getModuleCatalog,
  getTenant,
  getTenantForEdit,
  getTenantActivity,
  getTenantModules,
  getTenants,
  getTenantUsers,
  updateTenant,
  updateTenantActivity,
  updateTenantModule,
  updateTenantUser,
} from "@/services/tenants/tenant-api";
import type { TenantCreationPayload } from "@/types/tenant-creation";
import type { TenantActivityItem, TenantUser } from "@/types/tenant";

export const tenantQueryKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantQueryKeys.all, "list"] as const,
  detail: (tenantId: string) =>
    [...tenantQueryKeys.all, "detail", tenantId] as const,
  businessUnits: ["tenant-catalog", "business-units"] as const,
  moduleCatalog: ["tenant-catalog", "modules"] as const,
  modules: (tenantId: string) =>
    [...tenantQueryKeys.all, tenantId, "modules"] as const,
  users: (tenantId: string) =>
    [...tenantQueryKeys.all, tenantId, "users"] as const,
  activity: (tenantId: string) =>
    [...tenantQueryKeys.all, tenantId, "activity"] as const,
};

export function useTenants() {
  return useQuery({
    queryKey: tenantQueryKeys.lists(),
    queryFn: getTenants,
  });
}

export function useTenant(tenantId: string) {
  return useQuery({
    queryKey: tenantQueryKeys.detail(tenantId),
    queryFn: () => getTenant(tenantId),
    enabled: Boolean(tenantId),
  });
}

export function useTenantForEdit(tenantId: string) {
  return useQuery({
    queryKey: [...tenantQueryKeys.detail(tenantId), "edit-form"],
    queryFn: () => getTenantForEdit(tenantId),
    enabled: Boolean(tenantId),
  });
}

export function useBusinessUnits(enabled = true) {
  return useQuery({
    queryKey: tenantQueryKeys.businessUnits,
    queryFn: getBusinessUnits,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useModuleCatalog(enabled = true) {
  return useQuery({
    queryKey: tenantQueryKeys.moduleCatalog,
    queryFn: getModuleCatalog,
    enabled,
    staleTime: 30 * 60 * 1000,
  });
}

export function useTenantModules(tenantId: string) {
  return useQuery({
    queryKey: tenantQueryKeys.modules(tenantId),
    queryFn: () => getTenantModules(tenantId),
    enabled: Boolean(tenantId),
  });
}

export function useTenantUsers(tenantId: string) {
  return useQuery({
    queryKey: tenantQueryKeys.users(tenantId),
    queryFn: () => getTenantUsers(tenantId),
    enabled: Boolean(tenantId),
  });
}

export function useTenantActivity(tenantId: string) {
  return useQuery({
    queryKey: tenantQueryKeys.activity(tenantId),
    queryFn: () => getTenantActivity(tenantId),
    enabled: Boolean(tenantId),
  });
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TenantCreationPayload) => createTenant(payload),
    onSuccess: async (tenant) => {
      queryClient.setQueryData(tenantQueryKeys.detail(tenant.id), tenant);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: [...tenantQueryKeys.detail(tenant.id), "edit-form"],
        }),
      ]);
    },
  });
}

export function useUpdateTenantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      payload,
    }: {
      tenantId: string;
      payload: TenantCreationPayload;
    }) => updateTenant(tenantId, payload),
    onSuccess: async (tenant, variables) => {
      queryClient.setQueryData(tenantQueryKeys.detail(tenant.id), tenant);
      queryClient.setQueryData(
        [...tenantQueryKeys.detail(tenant.id), "edit-form"],
        { tenant, payload: variables.payload },
      );
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
    },
  });
}

export function useDeleteTenantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTenant,
    onSuccess: async (_, tenantId) => {
      queryClient.removeQueries({
        queryKey: tenantQueryKeys.detail(tenantId),
      });
      queryClient.removeQueries({
        queryKey: [...tenantQueryKeys.all, tenantId],
      });
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
    },
  });
}

export function useUpdateTenantModuleMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, enabled }: { moduleId: string; enabled: boolean }) =>
      updateTenantModule(tenantId, moduleId, enabled),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tenantQueryKeys.modules(tenantId),
        }),
        queryClient.invalidateQueries({
          queryKey: tenantQueryKeys.detail(tenantId),
        }),
        queryClient.invalidateQueries({
          queryKey: tenantQueryKeys.lists(),
        }),
      ]);
    },
  });
}

export function useDeleteTenantModuleMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTenantModule,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.modules(tenantId),
      }),
  });
}

export function useCreateTenantUserMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: Omit<TenantUser, "id">) => createTenantUser(user),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.users(tenantId) }),
  });
}

export function useUpdateTenantUserMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<Omit<TenantUser, "id" | "tenantId">>;
    }) => updateTenantUser(userId, updates),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.users(tenantId) }),
  });
}

export function useDeleteTenantUserMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTenantUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.users(tenantId) }),
  });
}

export function useCreateTenantActivityMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activity: Omit<TenantActivityItem, "id">) =>
      createTenantActivity(activity),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.activity(tenantId),
      }),
  });
}

export function useUpdateTenantActivityMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      activityId,
      updates,
    }: {
      activityId: string;
      updates: Partial<Omit<TenantActivityItem, "id" | "tenantId">>;
    }) => updateTenantActivity(activityId, updates),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.activity(tenantId),
      }),
  });
}

export function useDeleteTenantActivityMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTenantActivity,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.activity(tenantId),
      }),
  });
}
