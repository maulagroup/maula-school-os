import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type { Tenant } from "@/types";

export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  const supabase = await createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("subdomain", subdomain)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    subdomain: data.subdomain,
    name: data.name,
    domain: data.domain,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function getTenantByCustomDomain(domain: string): Promise<Tenant | null> {
  const supabase = await createServiceSupabaseClient();
  
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("domain", domain)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    subdomain: data.subdomain,
    name: data.name,
    domain: data.domain,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}
