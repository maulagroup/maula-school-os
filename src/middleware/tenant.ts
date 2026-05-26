import type { HostnameResolution } from "@/lib/tenant/utils";

export interface TenantMiddlewareResult {
  resolution: HostnameResolution;
  isValid: boolean;
}

export async function tenantMiddleware(resolution: HostnameResolution): Promise<TenantMiddlewareResult> {
  return {
    resolution,
    isValid: true,
  };
}
