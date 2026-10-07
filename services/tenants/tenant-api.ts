import type { TenantDetails } from "@/types/tenant";

export type GetTenantsResponse = {
  success: boolean;
  data: TenantDetails[];
};

export async function getTenants(): Promise<GetTenantsResponse> {
  const response = await fetch("/api/tenants", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tenants.");
  }

  return data;
}