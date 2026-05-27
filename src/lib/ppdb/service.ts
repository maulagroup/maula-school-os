import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

const supabase = createClientComponentClient<Database>();

export async function getPPDBPeriods(tenantId: string) {
  const { data, error } = await supabase
    .from('ppdb_periods')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching PPDB periods:', error);
    return [];
  }

  return data || [];
}

export async function getActivePPDBPeriod(tenantId: string) {
  const { data, error } = await supabase
    .from('ppdb_periods')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getPPDBRegistrations(tenantId: string) {
  const { data, error } = await supabase
    .from('ppdb_registrations')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching PPDB registrations:', error);
    return [];
  }

  return data || [];
}

export async function getRegistrationCounts(tenantId: string) {
  const { data, error } = await supabase
    .from('ppdb_registrations')
    .select('status', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error fetching registration counts:', error);
    return { total: 0, submitted: 0, accepted: 0 };
  }

  return { total: data?.length || 0, submitted: 0, accepted: 0 };
}
