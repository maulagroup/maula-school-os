import type { User, Session } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "@/types";

export async function getCurrentUser(
  supabase: SupabaseClient
): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession(
  supabase: SupabaseClient
): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export interface AuthContext {
  user: User | null;
  session: Session | null;
  tenantId?: string;
  role?: UserRole;
}

export async function getAuthContext(
  supabase: SupabaseClient
): Promise<AuthContext> {
  const [user, session] = await Promise.all([
    getCurrentUser(supabase),
    getCurrentSession(supabase),
  ]);

  return {
    user,
    session,
  };
}

export function isAuthenticated(authContext: AuthContext): boolean {
  return authContext.user !== null && authContext.session !== null;
}

export function hasRole(authContext: AuthContext, requiredRole: UserRole): boolean {
  if (!isAuthenticated(authContext) || !authContext.role) {
    return false;
  }
  return authContext.role === requiredRole;
}

export function hasAnyRole(authContext: AuthContext, roles: UserRole[]): boolean {
  if (!isAuthenticated(authContext) || !authContext.role) {
    return false;
  }
  return roles.includes(authContext.role);
}

export function isTenantMember(authContext: AuthContext, tenantId: string): boolean {
  if (!isAuthenticated(authContext) || !authContext.tenantId) {
    return false;
  }
  return authContext.tenantId === tenantId;
}
