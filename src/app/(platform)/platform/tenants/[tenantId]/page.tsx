import { getTenantById } from '@/app/actions/platform';
import TenantDetailClient from '@/components/platform/tenants/TenantDetailClient';
import type { TenantDetail } from '@/components/platform/tenants/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: { tenantId: string };
}

export default async function TenantDetailPage({ params }: Props) {
  const tenant = await getTenantById(params.tenantId);

  return <TenantDetailClient tenant={tenant as unknown as TenantDetail} />;
}
