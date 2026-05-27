import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function SchedulingPage() {
  return (
    <div>
      <PageHeader
        title="Jadwal"
        subtitle="Kelola jadwal sekolah"
      />
      
      <Card>
        <EmptyState
          title="Jadwal"
          description="Halaman manajemen jadwal akan segera tersedia"
        />
      </Card>
    </div>
  );
}
