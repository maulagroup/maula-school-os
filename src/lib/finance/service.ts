import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

const supabase = createClientComponentClient<Database>();

export async function getStudentBills(tenantId: string) {
  const { data, error } = await supabase
    .from('student_bills')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching student bills:', error);
    return [];
  }

  return data || [];
}

export async function getBillingStats(tenantId: string) {
  const { data, error } = await supabase
    .from('student_bills')
    .select('status', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (error) {
    console.error('Error fetching billing stats:', error);
    return { total: 0, unpaid: 0, partial: 0, paid: 0, overdue: 0 };
  }

  return { total: data?.length || 0, unpaid: 0, partial: 0, paid: 0, overdue: 0 };
}

export async function getPayments(tenantId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('payment_date', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }

  return data || [];
}
