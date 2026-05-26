import { redirect } from 'next/navigation';
import Shell from '@/components/layout/Shell';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { resolveUserAccess } from '@/lib/middleware/auth';


export const dynamic = 'force-dynamic';

const platformNavItems = [
  { label: 'Dashboard', href: '/platform' },
  { label: 'Tenants', href: '/platform/tenants' },
  { label: 'Users', href: '/platform/users' },
];

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const userAccess = await resolveUserAccess(supabase);

  if (!userAccess.isAuthenticated) {
    redirect('/login');
  }

  if (!userAccess.isPlatformAdmin) {
    redirect('/forbidden');
  }

  return (
    <Shell
      sidebar={
        <Sidebar
          brand="MAULA PLATFORM"
          navItems={platformNavItems}
        />
      }
      topbar={
        <Topbar
          userEmail={userAccess.activeTenantName || 'User'}
        />
      }
    >
      {children}
    </Shell>
  );
}
