import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function AcademicYearsPage() {
  return (
    <div>
      <PageHeader
        title="Tahun Ajaran"
        subtitle="Kelola tahun ajaran sekolah"
      />
      
      <Card>
        <EmptyState
          title="Belum ada tahun ajaran"
          description="Buat tahun ajaran baru untuk memulai setup sekolah"
          cta={{ label: 'Buat Tahun Ajaran', href: '#' }}
        />
      </Card>
    </div>
  );
}
