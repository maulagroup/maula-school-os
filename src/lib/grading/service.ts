import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AssessmentCategory, Assessment, StudentGrade } from '@/types/database';

export async function getAssessmentCategories(tenantId: string, academicYearId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('assessment_categories')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as AssessmentCategory[];
}

export async function getAssessments(tenantId: string, academicYearId?: string, classId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('assessments')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  if (classId) {
    query = query.eq('class_id', classId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Assessment[];
}

export async function getStudentGrades(tenantId: string, assessmentId?: string, studentProfileId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('student_grades')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (assessmentId) {
    query = query.eq('assessment_id', assessmentId);
  }

  if (studentProfileId) {
    query = query.eq('student_profile_id', studentProfileId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as StudentGrade[];
}
