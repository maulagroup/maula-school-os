import { redirect } from 'next/navigation';
import Shell from '@/components/layout/Shell';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { resolveUserAccess } from '@/lib/middleware/auth';
import { TenantProviderWrapper } from './tenant-provider-wrapper';
import type { TenantRoleCode } from '@/types/database';

export const dynamic = 'force-dynamic';

interface NavItem {
  label: string;
  href: string;
  roles: TenantRoleCode[];
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const tenantNavItems: NavItem[] = [
  { 
    label: 'Dashboard', 
    href: '/portal', 
    roles: ['school_owner', 'school_admin', 'teacher', 'student', 'parent'] 
  },
];

const tenantNavGroups: NavGroup[] = [
  {
    label: 'Pembelajaran',
    items: [
      { 
        label: 'LMS', 
        href: '/portal/lms', 
        roles: ['school_owner', 'school_admin', 'teacher', 'student'] 
      },
      { 
        label: 'Absensi', 
        href: '/portal/attendance', 
        roles: ['school_owner', 'school_admin', 'teacher'] 
      },
      { 
        label: 'Jadwal', 
        href: '/portal/scheduling', 
        roles: ['school_owner', 'school_admin', 'teacher'] 
      },
      { 
        label: 'Penilaian', 
        href: '/portal/grading', 
        roles: ['school_owner', 'school_admin', 'teacher'] 
      },
    ]
  },
  {
    label: 'Data Sekolah',
    items: [
      { 
        label: 'Direktori', 
        href: '/portal/people', 
        roles: ['school_owner', 'school_admin', 'teacher'] 
      },
      { 
        label: 'Tahun Ajaran', 
        href: '/portal/academic-years', 
        roles: ['school_owner', 'school_admin'] 
      },
      { 
        label: 'Kelas', 
        href: '/portal/classes', 
        roles: ['school_owner', 'school_admin', 'teacher'] 
      },
      { 
        label: 'Jurusan', 
        href: '/portal/departments', 
        roles: ['school_owner', 'school_admin'] 
      },
      { 
        label: 'Guru', 
        href: '/portal/teachers', 
        roles: ['school_owner', 'school_admin'] 
      },
      { 
        label: 'Siswa', 
        href: '/portal/students', 
        roles: ['school_owner', 'school_admin', 'teacher'] 
      },
    ]
  },
  {
    label: 'Komunikasi',
    items: [
      { 
        label: 'Notifikasi', 
        href: '/portal/notifications', 
        roles: ['school_owner', 'school_admin', 'teacher', 'student', 'parent'] 
      },
      { 
        label: 'Pengumuman', 
        href: '/portal/announcements', 
        roles: ['school_owner', 'school_admin', 'teacher', 'student', 'parent'] 
      },
    ]
  },
  {
    label: 'Lainnya',
    items: [
      { 
        label: 'PPDB', 
        href: '/portal/ppdb', 
        roles: ['school_owner', 'school_admin'] 
      },
      { 
        label: 'Keuangan', 
        href: '/portal/finance', 
        roles: ['school_owner', 'school_admin'] 
      },
      { 
        label: 'Pengaturan', 
        href: '/portal/settings', 
        roles: ['school_owner', 'school_admin'] 
      },
    ]
  },
];

function getNavItemsForRole(roleCode: TenantRoleCode | undefined): { label: string; href: string }[] {
  return tenantNavItems
    .filter(item => !roleCode || item.roles.includes(roleCode))
    .map(item => ({ label: item.label, href: item.href }));
}

function getNavGroupsForRole(roleCode: TenantRoleCode | undefined): { label?: string; items: { label: string; href: string }[] }[] {
  return tenantNavGroups
    .map(group => ({
      label: group.label,
      items: group.items
        .filter(item => !roleCode || item.roles.includes(roleCode))
        .map(item => ({ label: item.label, href: item.href })),
    }))
    .filter(group => group.items.length > 0);
}

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

  const navItems = getNavItemsForRole(userAccess.activeRoleCode as TenantRoleCode);
  const navGroups = getNavGroupsForRole(userAccess.activeRoleCode as TenantRoleCode);

  return (
    <TenantProviderWrapper userAccess={userAccess}>
      <Shell
        sidebar={
          <Sidebar
            brand={userAccess.activeTenantName || 'MAULA SCHOOL'}
            navItems={navItems}
            navGroups={navGroups}
          />
        }
        topbar={
          <Topbar
            userEmail={userAccess.currentUser?.email || 'User'}
            tenantName={userAccess.activeTenantName}
            currentRole={userAccess.activeRoleCode}
            availableTenants={userAccess.tenantMemberships}
          />
        }
      >
        {children}
      </Shell>
    </TenantProviderWrapper>
  );
}
