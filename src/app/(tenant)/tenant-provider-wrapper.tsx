'use client';

import { TenantProvider } from '@/lib/tenant/context';
import type { UserAccessResult } from '@/lib/auth/types';

export function TenantProviderWrapper({
  children,
  userAccess,
}: {
  children: React.ReactNode;
  userAccess: UserAccessResult;
}) {
  return (
    <TenantProvider userAccess={userAccess}>
      {children}
    </TenantProvider>
  );
}
