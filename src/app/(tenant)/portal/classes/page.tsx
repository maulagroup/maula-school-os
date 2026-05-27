import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function ClassesPage() {
  return (
    <div>
      <PageHeader title="Kelas" subtitle="Kelola data kelas sekolah" />
      
      <Card>
        <EmptyState
          title="Belum ada kelas"
          description="Buat kelas baru untuk setup rombongan belajar"
          cta={{ label: 'Buat Kelas', href: '#' }}
        />
      </Card>
    </div>
  );
}
