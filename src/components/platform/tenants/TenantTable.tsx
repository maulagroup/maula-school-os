import Link from 'next/link';
import TenantStatusBadge from './TenantStatusBadge';
import type { TenantListItem } from './types';

interface TenantTableProps {
  tenants: TenantListItem[];
}

export default function TenantTable({ tenants }: TenantTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPrimaryDomain = (tenant: TenantListItem) => {
    return tenant.domains?.find((d) => d.is_primary)?.domain || '-';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              School Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Domain
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/platform/tenants/${tenant.id}`} className="text-blue-600 hover:underline">
                  <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getPrimaryDomain(tenant)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tenant.slug}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <TenantStatusBadge status={tenant.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(tenant.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
