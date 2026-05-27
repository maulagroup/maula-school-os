import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function LMSPage() {
  return (
    <div>
      <PageHeader
        title="LMS"
        subtitle="Kelola pembelajaran digital"
      />
      
      <Card>
        <EmptyState
          title="LMS"
          description="Halaman manajemen pembelajaran digital akan segera tersedia"
        />
      </Card>
    </div>
  );
}
