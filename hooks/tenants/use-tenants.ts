"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenants } from "@/services/tenants/tenant-api";

export function useTenants() {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });
}