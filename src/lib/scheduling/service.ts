import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { TimeSlot, ClassSchedule, TeacherSchedule } from '@/types/database';

export async function getTimeSlots(tenantId: string, academicYearId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('time_slots')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as TimeSlot[];
}

export async function getClassSchedules(tenantId: string, academicYearId?: string, classId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('class_schedules')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  if (classId) {
    query = query.eq('class_id', classId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as ClassSchedule[];
}

export async function getTeacherSchedules(tenantId: string, academicYearId?: string, teacherProfileId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('teacher_schedules')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  if (teacherProfileId) {
    query = query.eq('teacher_profile_id', teacherProfileId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as TeacherSchedule[];
}
