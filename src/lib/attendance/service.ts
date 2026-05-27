import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AttendanceSession, StudentAttendance, TeacherAttendance } from '@/types/database';

export async function getAttendanceSessions(tenantId: string, academicYearId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('attendance_sessions')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('session_date', { ascending: false });

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as AttendanceSession[];
}

export async function getStudentAttendance(tenantId: string, attendanceSessionId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('student_attendance')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (attendanceSessionId) {
    query = query.eq('attendance_session_id', attendanceSessionId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as StudentAttendance[];
}

export async function getTeacherAttendance(tenantId: string, academicYearId?: string, teacherProfileId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('teacher_attendance')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('attendance_date', { ascending: false });

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  if (teacherProfileId) {
    query = query.eq('teacher_profile_id', teacherProfileId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as TeacherAttendance[];
}
