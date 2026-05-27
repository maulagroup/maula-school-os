import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

const stats = [
  { label: 'Total Tagihan', value: '0', color: 'text-primary-600' },
  { label: 'Belum Dibayar', value: '0', color: 'text-danger-600' },
  { label: 'Lunas', value: '0', color: 'text-success-600' },
];

export default function FinancePage() {
  return (
    <div>
      <PageHeader title="Keuangan" subtitle="Kelola tagihan dan pembayaran" />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <h3 className="text-sm font-medium text-secondary-600 mb-2">{stat.label}</h3>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>
      
      <Card>
        <EmptyState
          title="Belum ada tagihan"
          description="Tagihan akan muncul di sini setelah dibuat"
        />
      </Card>
    </div>
  );
}
