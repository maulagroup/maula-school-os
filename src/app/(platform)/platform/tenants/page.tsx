import TenantsPageClient from '@/components/platform/tenants/TenantsPageClient';
import { getTenants } from '@/app/actions/platform';

export const dynamic = 'force-dynamic';

export default async function TenantsPage() {
  const tenants = await getTenants();

  return (
    <TenantsPageClient initialTenants={tenants} />
  );
}
