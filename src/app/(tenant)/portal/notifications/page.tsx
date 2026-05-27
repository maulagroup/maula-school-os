import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifikasi" subtitle="Lihat semua notifikasi Anda" />
      
      <Card>
        <EmptyState
          title="Belum ada notifikasi"
          description="Notifikasi akan muncul di sini"
        />
      </Card>
    </div>
  );
}
