import { redirect } from 'next/navigation';
import Shell from '@/components/layout/Shell';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { getAuthContext } from '@/lib/auth/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect('/login');
  }

  const supabase = await createServerSupabaseClient();
  const { data: memberships } = await supabase
    .from('memberships')
    .select(`
      roles!inner (
        role_code,
        role_scope
      )
    `)
    .eq('user_id', authContext.user.id)
    .eq('status', 'active')
    .is('deleted_at', null);

  const isPlatformAdmin = memberships?.some(
    (m) => m.roles.role_scope === 'platform' &&
           ['super_admin_platform', 'support_admin', 'finance_admin'].includes(m.roles.role_code)
  );

  if (!isPlatformAdmin) {
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
          userEmail={authContext.user.email}
        />
      }
    >
      {children}
    </Shell>
  );
}
