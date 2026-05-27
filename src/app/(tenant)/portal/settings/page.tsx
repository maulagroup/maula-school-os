import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';

const settingItems = [
  {
    title: 'Branding',
    description: 'Sesuaikan warna, logo, dan identitas sekolah',
    href: '/portal/settings/branding',
  },
  {
    title: 'Profil Sekolah',
    description: 'Pengaturan profil sekolah',
    href: '#',
  },
  {
    title: 'Domain',
    description: 'Pengaturan domain sekolah',
    href: '#',
  },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Pengaturan" subtitle="Kelola pengaturan sekolah Anda" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingItems.map((item, index) => (
          <a 
            key={index}
            href={item.href}
            className="block"
          >
            <Card className="hover:bg-secondary-50 transition-colors cursor-pointer">
              <h3 className="text-lg font-semibold mb-2 text-secondary-900">{item.title}</h3>
              <p className="text-secondary-500">{item.description}</p>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
