import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function AttendancePage() {
  return (
    <div>
      <PageHeader
        title="Absensi"
        subtitle="Kelola absensi sekolah"
      />
      
      <Card>
        <EmptyState
          title="Absensi"
          description="Halaman manajemen absensi akan segera tersedia"
        />
      </Card>
    </div>
  );
}
