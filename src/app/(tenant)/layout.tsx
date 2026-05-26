import { redirect } from 'next/navigation';
import Shell from '@/components/layout/Shell';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { getAuthContext } from '@/lib/auth/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect('/login');
  }

  const supabase = await createServerSupabaseClient();
  const { data: memberships } = await supabase
    .from('memberships')
    .select(`
      id,
      tenant_id,
      roles!inner (
        role_code,
        role_name
      ),
      tenants!inner (
        id,
        name
      )
    `)
    .eq('user_id', authContext.user.id)
    .eq('status', 'active')
    .is('deleted_at', null);

  const activeMembership = memberships?.[0];

  if (!activeMembership) {
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
          userEmail={authContext.user.email}
          tenantName={activeMembership.tenants.name}
        />
      }
    >
      {children}
    </Shell>
  );
}
