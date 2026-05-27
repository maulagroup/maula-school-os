import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Notification, Announcement } from '@/types/database';

export async function getUserNotifications(userId: string, tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data as Notification[];
}

export async function getUnreadCount(userId: string, tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .eq('status', 'unread');

  if (error) throw error;
  return count || 0;
}

export async function markAsRead(notificationId: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('notifications')
    .update({ status: 'read', read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) throw error;
}

export async function markAllAsRead(userId: string, tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('notifications')
    .update({ status: 'read', read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .eq('status', 'unread');

  if (error) throw error;
}

export async function getAnnouncements(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data as Announcement[];
}
