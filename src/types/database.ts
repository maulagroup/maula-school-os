export type TenantStatus = "active" | "inactive" | "suspended";
export type MembershipStatus = "active" | "inactive" | "pending" | "invited";
export type RoleScope = "platform" | "tenant";
export type DomainType = "subdomain" | "custom";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  createdBy?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Domain {
  id: string;
  tenantId: string;
  domain: string;
  type: DomainType;
  isPrimary: boolean;
  verifiedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Role {
  id: string;
  roleCode: string;
  roleName: string;
  roleScope: RoleScope;
  description?: string;
  isSystem: boolean;
  parentRoleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  tenantId: string;
  roleId: string;
  status: MembershipStatus;
  invitedBy?: string;
  invitedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type PlatformRoleCode = "super_admin_platform" | "support_admin" | "finance_admin";
export type TenantRoleCode = "school_owner" | "school_admin" | "teacher" | "student" | "parent";
export type RoleCode = PlatformRoleCode | TenantRoleCode;
