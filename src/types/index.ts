export interface Tenant {
  id: string;
  subdomain: string;
  name: string;
  domain?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  tenantId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "super_admin" | "admin" | "teacher" | "student" | "parent";

export interface Session {
  user: User;
  tenant: Tenant;
  accessToken: string;
  refreshToken: string;
}
