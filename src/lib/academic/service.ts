import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AcademicYear, SchoolLevel, Department, Class, TeacherProfile, StudentProfile } from '@/types/database';

export async function getAcademicYears(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data as AcademicYear[];
}

export async function getActiveAcademicYear(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as AcademicYear | null;
}

export async function getSchoolLevels(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('school_levels')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as SchoolLevel[];
}

export async function getDepartments(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Department[];
}

export async function getClasses(tenantId: string, academicYearId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('classes')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  const { data, error } = await query.order('name', { ascending: true });

  if (error) throw error;
  return data as Class[];
}
