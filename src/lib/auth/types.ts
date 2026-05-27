import type { PlatformRoleCode, TenantRoleCode } from '@/types/database';

export interface MembershipWithRoleAndTenant {
  id: string;
  userId: string;
  tenantId: string;
  roleId: string;
  status: string;
  invitedBy?: string;
  invitedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  roles: {
    roleCode: PlatformRoleCode | TenantRoleCode;
    roleName: string;
    roleScope: 'platform' | 'tenant';
  };
  tenants?: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
}

export interface UserAccessResult {
  isAuthenticated: boolean;
  hasValidMembership: boolean;
  isPlatformAdmin: boolean;
  activeTenantId?: string;
  activeRoleCode?: PlatformRoleCode | TenantRoleCode;
  activeTenantName?: string;
  currentUser?: {
    id: string;
    email?: string;
  };
  allMemberships: MembershipWithRoleAndTenant[];
  activeMemberships: MembershipWithRoleAndTenant[];
  pendingMemberships: MembershipWithRoleAndTenant[];
  invitedMemberships: MembershipWithRoleAndTenant[];
  suspendedMemberships: MembershipWithRoleAndTenant[];
  platformMemberships: MembershipWithRoleAndTenant[];
  tenantMemberships: MembershipWithRoleAndTenant[];
  platformRoles: PlatformRoleCode[];
  tenantRoles: TenantRoleCode[];
  currentTenantMembership?: MembershipWithRoleAndTenant;
  currentPlatformMembership?: MembershipWithRoleAndTenant;
}

export interface AuthActionResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}
