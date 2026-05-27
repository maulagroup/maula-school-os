import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function GradingPage() {
  return (
    <div>
      <PageHeader
        title="Penilaian"
        subtitle="Kelola penilaian akademik"
      />
      
      <Card>
        <EmptyState
          title="Penilaian"
          description="Halaman manajemen penilaian akan segera tersedia"
        />
      </Card>
    </div>
  );
}
