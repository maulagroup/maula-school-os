import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { PPDBPeriod, PPDBRegistration } from '@/types/database';

export async function getPPDBPeriods(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('ppdb_periods')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data as PPDBPeriod[];
}

export async function getActivePPDBPeriod(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('ppdb_periods')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as PPDBPeriod | null;
}

export async function getPPDBRegistrations(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('ppdb_registrations')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PPDBRegistration[];
}

export async function getRegistrationCounts(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('ppdb_registrations')
    .select('status', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (error) throw error;
  return { total: data?.length || 0, submitted: 0, accepted: 0 };
}
