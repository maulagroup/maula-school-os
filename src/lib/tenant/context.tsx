'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import type { UserAccessResult, MembershipWithRoleAndTenant } from '@/lib/auth/types';
import type { PlatformRoleCode, TenantRoleCode } from '@/types/database';

interface TenantContextValue {
  memberships: MembershipWithRoleAndTenant[];
  currentTenantMembership?: MembershipWithRoleAndTenant;
  currentTenant?: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  currentRole?: PlatformRoleCode | TenantRoleCode;
  availableTenants: MembershipWithRoleAndTenant[];
  isPlatformAdmin: boolean;
  isSwitchingTenant: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: ReactNode;
  userAccess: UserAccessResult;
}

export function TenantProvider({ children, userAccess }: TenantProviderProps) {
  const [isSwitchingTenant, setIsSwitchingTenant] = useState(false);
  const [currentTenantMembership, setCurrentTenantMembership] = useState<
    MembershipWithRoleAndTenant | undefined
  >(userAccess.currentTenantMembership);

  const memberships = useMemo(() => userAccess.allMemberships, [userAccess.allMemberships]);

  const availableTenants = useMemo(
    () => userAccess.tenantMemberships,
    [userAccess.tenantMemberships]
  );

  const currentTenant = useMemo(() => {
    return currentTenantMembership?.tenants;
  }, [currentTenantMembership]);

  const currentRole = useMemo(() => {
    return currentTenantMembership?.roles.roleCode || userAccess.currentPlatformMembership?.roles.roleCode;
  }, [currentTenantMembership, userAccess.currentPlatformMembership]);

  const isPlatformAdmin = useMemo(
    () => userAccess.isPlatformAdmin,
    [userAccess.isPlatformAdmin]
  );

  const validateTenantSwitch = useCallback(
    (tenantId: string): { valid: boolean; error?: string } => {
      const targetMembership = availableTenants.find((m) => m.tenantId === tenantId);

      if (!targetMembership) {
        return { valid: false, error: 'Membership not found' };
      }

      if (targetMembership.status !== 'active') {
        return { valid: false, error: 'Membership not active' };
      }

      if (targetMembership.deletedAt) {
        return { valid: false, error: 'Membership deleted' };
      }

      if (targetMembership.tenants?.status !== 'active') {
        return { valid: false, error: 'Tenant not active' };
      }

      return { valid: true };
    },
    [availableTenants]
  );

  const switchTenant = useCallback(
    async (tenantId: string) => {
      const validation = validateTenantSwitch(tenantId);

      if (!validation.valid) {
        console.error('Tenant switch validation failed:', validation.error);
        return;
      }

      setIsSwitchingTenant(true);

      try {
        const targetMembership = availableTenants.find((m) => m.tenantId === tenantId);

        if (targetMembership) {
          setCurrentTenantMembership(targetMembership);

          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          document.cookie = `active_tenant_id=${tenantId}; path=/; expires=${nextYear.toUTCString()}; SameSite=Lax`;
        }
      } catch (error) {
        console.error('Failed to switch tenant:', error);
      } finally {
        setIsSwitchingTenant(false);
      }
    },
    [availableTenants, validateTenantSwitch]
  );

  const contextValue = useMemo(
    () => ({
      memberships,
      currentTenantMembership,
      currentTenant,
      currentRole,
      availableTenants,
      isPlatformAdmin,
      isSwitchingTenant,
      switchTenant,
    }),
    [
      memberships,
      currentTenantMembership,
      currentTenant,
      currentRole,
      availableTenants,
      isPlatformAdmin,
      isSwitchingTenant,
      switchTenant,
    ]
  );

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);

  if (context === null) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
}
