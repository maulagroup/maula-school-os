import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import DataTable from '@/components/data-display/data-table';
import { demoStudents } from '@/lib/demo/data';

export default function StudentsPage() {
  const columns = [
    { key: 'name', header: 'Nama' },
    { key: 'nis', header: 'NIS' },
    { key: 'class', header: 'Kelas' },
  ];

  return (
    <div>
      <PageHeader title="Siswa" subtitle="Kelola data siswa sekolah" />
      
      <Card>
        {demoStudents.length > 0 ? (
          <DataTable 
            data={demoStudents} 
            columns={columns} 
            keyExtractor={(item) => item.id}
          />
        ) : (
          <EmptyState
            title="Belum ada siswa"
            description="Tambahkan siswa untuk memulai setup sekolah"
            cta={{ label: 'Tambah Siswa', href: '#' }}
          />
        )}
      </Card>
    </div>
  );
}
