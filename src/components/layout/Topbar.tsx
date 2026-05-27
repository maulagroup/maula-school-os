import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import { ROLE_CONFIG } from '@/lib/design-system/constants';
import type { PlatformRoleCode, TenantRoleCode } from '@/types/database';
import type { MembershipWithRoleAndTenant } from '@/lib/auth/types';

interface TopbarProps {
  title?: string;
  userEmail?: string;
  tenantName?: string;
  currentRole?: PlatformRoleCode | TenantRoleCode;
  availableTenants?: MembershipWithRoleAndTenant[];
}

export default function Topbar({
  title,
  userEmail,
  tenantName,
  currentRole,
  availableTenants,
}: TopbarProps) {
  const roleConfig = currentRole ? ROLE_CONFIG[currentRole as keyof typeof ROLE_CONFIG] : null;

  return (
    <div className="h-full flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded-lg hover:bg-secondary-100">
          <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {title && <h1 className="text-lg font-semibold text-secondary-900">{title}</h1>}
        {tenantName && (
          <div className="flex items-center gap-2">
            <StatusBadge variant="info">{tenantName}</StatusBadge>
            {availableTenants && availableTenants.length > 1 && (
              <div className="text-sm text-secondary-500 cursor-pointer hover:text-secondary-700 flex items-center gap-1">
                Switch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>
        )}
        {roleConfig && (
          <StatusBadge variant={roleConfig.variant}>{roleConfig.label}</StatusBadge>
        )}
      </div>
      <div className="flex items-center gap-4">
        {userEmail && <span className="text-sm text-secondary-600 hidden sm:block">{userEmail}</span>}
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
