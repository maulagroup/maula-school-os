import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function AnnouncementsPage() {
  return (
    <div>
      <PageHeader title="Pengumuman" subtitle="Pengumuman dan informasi sekolah" />
      
      <Card>
        <EmptyState
          title="Belum ada pengumuman"
          description="Pengumuman sekolah akan muncul di sini"
        />
      </Card>
    </div>
  );
}
