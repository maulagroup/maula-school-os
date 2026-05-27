import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function DepartmentsPage() {
  return (
    <div>
      <PageHeader
        title="Jurusan"
        subtitle="Kelola jurusan dan program keahlian"
      />
      
      <Card>
        <EmptyState
          title="Belum ada jurusan"
          description="Buat jurusan baru untuk SMA/SMK"
          cta={{ label: 'Buat Jurusan', href: '#' }}
        />
      </Card>
    </div>
  );
}
