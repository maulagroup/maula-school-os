'use client';

import { useTenant } from '@/lib/tenant/context';
import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import StatusBadge from '@/components/ui/status-badge';
import { STATUS_CONFIG } from '@/lib/design-system/constants';
import OnboardingChecklist, { type OnboardingStep } from '@/components/tenant/onboarding-checklist';
import { demoStats, demoActivityFeed, type DemoActivity } from '@/lib/demo/data';

function ActivityItem({ activity }: { activity: DemoActivity }) {
  const typeColors = {
    attendance: 'bg-success-100 text-success-700',
    lms: 'bg-primary-100 text-primary-700',
    grading: 'bg-info-100 text-info-700',
    onboarding: 'bg-warning-100 text-warning-700',
  };

  const typeLabels = {
    attendance: 'Absensi',
    lms: 'LMS',
    grading: 'Penilaian',
    onboarding: 'Setup',
  };

  return (
    <div className="flex items-start gap-4 py-3 border-b border-secondary-100 last:border-0">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeColors[activity.type]}`}>
        {activity.type === 'attendance' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {activity.type === 'lms' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )}
        {activity.type === 'grading' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        )}
        {activity.type === 'onboarding' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065c.426-1.756 2.924-1.756 3.35 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-secondary-500 uppercase tracking-wide">
            {typeLabels[activity.type]}
          </span>
          <span className="text-xs text-secondary-400">{activity.time}</span>
        </div>
        <p className="font-medium text-secondary-900">{activity.title}</p>
        <p className="text-sm text-secondary-500">{activity.description}</p>
      </div>
    </div>
  );
}

export default function TenantPortalDashboard() {
  const { currentTenant, currentRole } = useTenant();
  const onboardingStatus = 'onboarding_incomplete';
  const onboardingConfig = STATUS_CONFIG[onboardingStatus as keyof typeof STATUS_CONFIG];

  const stats = [
    { label: 'Siswa', value: demoStats.students.toString(), description: 'Total siswa terdaftar', color: 'text-primary-600' },
    { label: 'Guru', value: demoStats.teachers.toString(), description: 'Total guru terdaftar', color: 'text-success-600' },
    { label: 'Kelas', value: demoStats.classes.toString(), description: 'Total kelas aktif', color: 'text-info-600' },
    { label: 'PPDB', value: '0', description: 'Pendaftar baru', color: 'text-warning-600' },
  ];

  const operationalInsights = [
    { label: 'Absensi Hari Ini', value: `${demoStats.attendanceToday.present}/${demoStats.students}`, color: 'text-success-600' },
    { label: 'Kelas Aktif', value: demoStats.classes.toString(), color: 'text-info-600' },
    { label: 'Tugas Menunggu', value: demoStats.assignmentsPending.toString(), color: 'text-warning-600' },
  ];

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'academic-year',
      label: 'Buat Tahun Ajaran',
      description: 'Setup tahun ajaran aktif',
      completed: true,
      href: '/portal/academic-years',
    },
    {
      id: 'classes',
      label: 'Buat Kelas',
      description: 'Setup kelas dan rombongan belajar',
      completed: true,
      href: '/portal/classes',
    },
    {
      id: 'teachers',
      label: 'Tambah Guru',
      description: 'Daftarkan guru dan staf sekolah',
      completed: true,
      href: '/portal/teachers',
    },
    {
      id: 'students',
      label: 'Tambah Siswa',
      description: 'Daftarkan siswa ke sistem',
      completed: false,
      href: '/portal/students',
    },
    {
      id: 'schedule',
      label: 'Buat Jadwal',
      description: 'Setup jadwal pembelajaran',
      completed: false,
      href: '/portal/scheduling',
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Selamat Datang di ${currentTenant?.name || 'Portal Sekolah'}`}
      >
        <div className="flex items-center gap-2">
          <StatusBadge variant="success">
            {currentRole?.replace(/_/g, ' ') || 'School Admin'}
          </StatusBadge>
          <StatusBadge variant={onboardingConfig.variant}>
            {onboardingConfig.label}
          </StatusBadge>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <h3 className="text-sm font-medium text-secondary-600 mb-2">{stat.label}</h3>
            <p className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-secondary-500">{stat.description}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {operationalInsights.map((insight, index) => (
          <Card key={index}>
            <h3 className="text-sm font-medium text-secondary-600 mb-2">{insight.label}</h3>
            <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-secondary-900">Aktivitas Terbaru</h3>
            <div>
              {demoActivityFeed.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-secondary-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="/portal/teachers" 
                className="text-center px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                Tambah Guru
              </a>
              <a 
                href="/portal/students" 
                className="text-center px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                Tambah Siswa
              </a>
              <a 
                href="/portal/classes" 
                className="text-center px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                Buat Kelas
              </a>
              <a 
                href="/portal/academic-years" 
                className="text-center px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                Tahun Ajaran
              </a>
            </div>
          </Card>
        </div>
        <OnboardingChecklist steps={onboardingSteps} />
      </div>
    </div>
  );
}
