import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { TeacherProfile, StudentProfile, StaffProfile, ParentProfile } from '@/types/database';

export async function getTeachers(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('teacher_profiles')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as TeacherProfile[];
}

export async function getStudents(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as StudentProfile[];
}

export async function getStaff(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as StaffProfile[];
}

export async function getParents(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('parent_profiles')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ParentProfile[];
}
