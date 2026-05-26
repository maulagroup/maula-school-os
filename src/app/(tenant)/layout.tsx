import { redirect } from 'next/navigation';
import Shell from '@/components/layout/Shell';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { resolveUserAccess } from '@/lib/middleware/auth';

const tenantNavItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'PPDB', href: '/dashboard/ppdb' },
  { label: 'Users', href: '/dashboard/users' },
  { label: 'Settings', href: '/dashboard/settings' },
];

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const userAccess = await resolveUserAccess(supabase);

  if (!userAccess.isAuthenticated) {
    redirect('/login');
  }

  if (!userAccess.hasValidMembership) {
    redirect('/unauthorized');
  }

  return (
    <Shell
      sidebar={
        <Sidebar
          brand="MAULA SCHOOL"
          navItems={tenantNavItems}
        />
      }
      topbar={
        <Topbar
          userEmail={userAccess.activeTenantName || 'User'}
          tenantName={userAccess.activeTenantName}
        />
      }
    >
      {children}
    </Shell>
  );
}
