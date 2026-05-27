import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import DataTable from '@/components/data-display/data-table';
import { demoTeachers } from '@/lib/demo/data';

export default function TeachersPage() {
  const columns = [
    { key: 'name', label: 'Nama' },
    { key: 'nip', label: 'NIP' },
    { key: 'subject', label: 'Mata Pelajaran' },
  ];

  return (
    <div>
      <PageHeader title="Guru" subtitle="Kelola data guru sekolah" />
      
      <Card>
        {demoTeachers.length > 0 ? (
          <DataTable data={demoTeachers} columns={columns} />
        ) : (
          <EmptyState
            title="Belum ada guru"
            description="Tambahkan guru untuk memulai setup sekolah"
            cta={{ label: 'Tambah Guru', href: '#' }}
          />
        )}
      </Card>
    </div>
  );
}
