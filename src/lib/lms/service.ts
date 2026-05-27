import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Classroom, ClassroomMember, LearningMaterial, ClassroomAssignment, ClassroomStream } from '@/types/database';

export async function getClassrooms(tenantId: string, academicYearId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('classrooms')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (academicYearId) {
    query = query.eq('academic_year_id', academicYearId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Classroom[];
}

export async function getClassroomMembers(tenantId: string, classroomId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('classroom_members')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('classroom_id', classroomId)
    .is('deleted_at', null);

  if (error) throw error;
  return data as ClassroomMember[];
}

export async function getLearningMaterials(tenantId: string, classroomId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('learning_materials')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('classroom_id', classroomId)
    .is('deleted_at', null)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as LearningMaterial[];
}

export async function getClassroomAssignments(tenantId: string, classroomId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('classroom_assignments')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('classroom_id', classroomId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ClassroomAssignment[];
}

export async function getClassroomStream(tenantId: string, classroomId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('classroom_stream')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('classroom_id', classroomId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ClassroomStream[];
}
