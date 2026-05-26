import { SupabaseClient } from '@supabase/supabase-js';
import { resolveHostname, HostnameType } from '@/lib/tenant/utils';

export async function resolveActiveTenantFromHostname(
  hostname: string,
  supabase: SupabaseClient
) {
  const hostnameResolution = resolveHostname(hostname);

  if (hostnameResolution.type === HostnameType.TENANT_SUBDOMAIN ||
      hostnameResolution.type === HostnameType.TENANT_CUSTOM_DOMAIN) {
    const tenantSlug = hostnameResolution.subdomain;
    if (tenantSlug) {
      const { data: tenant } = await supabase
        .from('tenants')
        .select('id, status')
        .eq('slug', tenantSlug)
        .eq('status', 'active')
        .is('deleted_at', null)
        .single();

      if (tenant) {
        return {
          tenantId: tenant.id,
          tenantStatus: tenant.status,
        };
      }
    }
  }

  return null;
}
