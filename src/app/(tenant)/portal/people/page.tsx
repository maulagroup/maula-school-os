import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function PeopleDirectoryPage() {
  return (
    <div>
      <PageHeader
        title="Direktori Orang"
        subtitle="Kelola semua orang di sekolah"
      />
      
      <Card>
        <EmptyState
          title="Direktori orang"
          description="Halaman direktori semua orang akan segera tersedia"
        />
      </Card>
    </div>
  );
}
