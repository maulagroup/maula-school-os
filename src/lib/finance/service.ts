import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { StudentBill, Payment } from '@/types/database';

export async function getStudentBills(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('student_bills')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as StudentBill[];
}

export async function getBillingStats(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('student_bills')
    .select('status', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (error) throw error;
  return { total: data?.length || 0, unpaid: 0, partial: 0, paid: 0, overdue: 0 };
}

export async function getPayments(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('payment_date', { ascending: false });

  if (error) throw error;
  return data as Payment[];
}
