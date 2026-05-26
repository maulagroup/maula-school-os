import { SupabaseClient } from '@supabase/supabase-js';
import { PLATFORM_ADMIN_ROLES } from '@/lib/auth/constants';
import type { UserAccessResult, MembershipWithRoleAndTenant } from '@/lib/auth/types';
import type { PlatformRoleCode, TenantRoleCode } from '@/types/database';

interface RawMembershipRole {
  role_code: string;
  role_name: string;
  role_scope: string;
}

interface RawMembershipTenant {
  id: string;
  name: string;
  slug: string;
  status: string;
}

interface RawMembership {
  id: string;
  user_id: string;
  tenant_id: string;
  role_id: string;
  status: string;
  invited_by: string | null;
  invited_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  roles: RawMembershipRole;
  tenants: RawMembershipTenant;
}

function formatMembership(raw: RawMembership): MembershipWithRoleAndTenant | null {
  const roleScope = raw.roles.role_scope as 'platform' | 'tenant';
  
  let validatedRoleCode: PlatformRoleCode | TenantRoleCode | null = null;
  
  if (roleScope === 'platform') {
    if (['super_admin_platform', 'support_admin', 'finance_admin'].includes(raw.roles.role_code)) {
      validatedRoleCode = raw.roles.role_code as PlatformRoleCode;
    }
  } else if (roleScope === 'tenant') {
    if (['school_owner', 'school_admin', 'teacher', 'student', 'parent'].includes(raw.roles.role_code)) {
      validatedRoleCode = raw.roles.role_code as TenantRoleCode;
    }
  }

  if (!validatedRoleCode) {
    return null;
  }

  return {
    id: raw.id,
    userId: raw.user_id,
    tenantId: raw.tenant_id,
    roleId: raw.role_id,
    status: raw.status,
    invitedBy: raw.invited_by || undefined,
    invitedAt: raw.invited_at ? new Date(raw.invited_at) : null,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
    deletedAt: raw.deleted_at ? new Date(raw.deleted_at) : null,
    roles: {
      roleCode: validatedRoleCode,
      roleName: raw.roles.role_name,
      roleScope,
    },
    tenants: {
      id: raw.tenants.id,
      name: raw.tenants.name,
      slug: raw.tenants.slug,
      status: raw.tenants.status,
    },
  };
}

function filterMemberships(
  memberships: MembershipWithRoleAndTenant[]
): {
  all: MembershipWithRoleAndTenant[];
  active: MembershipWithRoleAndTenant[];
  pending: MembershipWithRoleAndTenant[];
  invited: MembershipWithRoleAndTenant[];
  suspended: MembershipWithRoleAndTenant[];
  platform: MembershipWithRoleAndTenant[];
  tenant: MembershipWithRoleAndTenant[];
} {
  const all = memberships;
  const active = memberships.filter(
    (m) =>
      m.status === 'active' &&
      m.deletedAt === null &&
      (m.tenants?.status === 'active')
  );
  const pending = memberships.filter((m) => m.status === 'pending');
  const invited = memberships.filter((m) => m.status === 'invited');
  const suspended = memberships.filter((m) => m.status === 'inactive' || m.status === 'suspended');
  const platform = active.filter((m) => m.roles.roleScope === 'platform');
  const tenant = active.filter((m) => m.roles.roleScope === 'tenant');

  return { all, active, pending, invited, suspended, platform, tenant };
}

function extractRoles(
  platformMemberships: MembershipWithRoleAndTenant[],
  tenantMemberships: MembershipWithRoleAndTenant[]
): {
  platformRoles: PlatformRoleCode[];
  tenantRoles: TenantRoleCode[];
} {
  const platformRoles = platformMemberships.map(
    (m) => m.roles.roleCode as PlatformRoleCode
  );
  const tenantRoles = tenantMemberships.map(
    (m) => m.roles.roleCode as TenantRoleCode
  );
  return { platformRoles, tenantRoles };
}

function selectActiveTenant(
  tenantMemberships: MembershipWithRoleAndTenant[]
): {
  currentTenantMembership?: MembershipWithRoleAndTenant;
  activeTenantId?: string;
  activeTenantName?: string;
  activeRoleCode?: TenantRoleCode;
} {
  if (tenantMemberships.length === 0) {
    return {};
  }

  const currentTenantMembership = tenantMemberships[0];
  return {
    currentTenantMembership,
    activeTenantId: currentTenantMembership.tenantId,
    activeTenantName: currentTenantMembership.tenants?.name,
    activeRoleCode: currentTenantMembership.roles.roleCode as TenantRoleCode,
  };
}

export async function resolveUserAccess(supabase: SupabaseClient): Promise<UserAccessResult> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return {
      isAuthenticated: false,
      hasValidMembership: false,
      isPlatformAdmin: false,
      activeMemberships: [],
      platformMemberships: [],
      tenantMemberships: [],
      pendingMemberships: [],
      invitedMemberships: [],
      suspendedMemberships: [],
      platformRoles: [],
      tenantRoles: [],
      allMemberships: [],
    };
  }

  const { data: rawMemberships, error: membershipError } = await supabase
    .from('memberships')
    .select(`
      id,
      user_id,
      tenant_id,
      role_id,
      status,
      invited_by,
      invited_at,
      created_at,
      updated_at,
      deleted_at,
      roles!inner (
        role_code,
        role_name,
        role_scope
      ),
      tenants!inner (
        id,
        name,
        slug,
        status
      )
    `)
    .eq('user_id', session.user.id);

  if (membershipError || !rawMemberships || rawMemberships.length === 0) {
    return {
      isAuthenticated: true,
      hasValidMembership: false,
      isPlatformAdmin: false,
      activeMemberships: [],
      platformMemberships: [],
      tenantMemberships: [],
      pendingMemberships: [],
      invitedMemberships: [],
      suspendedMemberships: [],
      platformRoles: [],
      tenantRoles: [],
      allMemberships: [],
    };
  }

  const formattedMemberships = rawMemberships
    .map((raw: unknown) => formatMembership(raw as RawMembership))
    .filter((m): m is MembershipWithRoleAndTenant => m !== null);

  const filtered = filterMemberships(formattedMemberships);
  const roles = extractRoles(filtered.platform, filtered.tenant);
  const activeTenant = selectActiveTenant(filtered.tenant);

  const isPlatformAdmin = roles.platformRoles.some(
    (role) => (PLATFORM_ADMIN_ROLES as readonly string[]).includes(role)
  );

  const currentPlatformMembership = filtered.platform[0];

  return {
    isAuthenticated: true,
    hasValidMembership: filtered.active.length > 0,
    isPlatformAdmin,
    activeTenantId: activeTenant.activeTenantId,
    activeRoleCode: activeTenant.activeRoleCode || currentPlatformMembership?.roles.roleCode,
    activeTenantName: activeTenant.activeTenantName,
    allMemberships: filtered.all,
    activeMemberships: filtered.active,
    pendingMemberships: filtered.pending,
    invitedMemberships: filtered.invited,
    suspendedMemberships: filtered.suspended,
    platformMemberships: filtered.platform,
    tenantMemberships: filtered.tenant,
    platformRoles: roles.platformRoles,
    tenantRoles: roles.tenantRoles,
    currentTenantMembership: activeTenant.currentTenantMembership,
    currentPlatformMembership,
  };
}
