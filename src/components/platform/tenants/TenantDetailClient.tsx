'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InviteSchoolAdminForm from './InviteSchoolAdminForm';
import TenantStatusBadge from './TenantStatusBadge';
import {
  TENANT_STATUS_CONFIG,
  MEMBERSHIP_STATUS_CONFIG,
  ONBOARDING_STATUS_CONFIG,
  type TenantDetail,
  type TenantOnboardingStatus,
} from './types';
import { getTenantById } from '@/app/actions/platform';

interface TenantDetailClientProps {
  tenant: TenantDetail;
}

export default function TenantDetailClient({ tenant: initialTenant }: TenantDetailClientProps) {
  const [tenant, setTenant] = useState(initialTenant);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const getOnboardingStatus = (): TenantOnboardingStatus => {
    const hasActiveAdmin = tenant.memberships.some(
      (m) => m.role?.role_code === 'school_admin' && m.status === 'active'
    );

    if (hasActiveAdmin) {
      return 'onboarding_complete';
    }

    const hasInvitedAdmin = tenant.memberships.some(
      (m) => m.role?.role_code === 'school_admin' && m.status === 'invited'
    );

    if (hasInvitedAdmin) {
      return 'waiting_admin_activation';
    }

    return 'onboarding_incomplete';
  };

  const onboardingStatus = getOnboardingStatus();
  const onboardingConfig = ONBOARDING_STATUS_CONFIG[onboardingStatus];

  const handleAdminInvited = async () => {
    setShowInviteForm(false);
    const updatedTenant = await getTenantById(tenant.id);
    setTenant(updatedTenant as unknown as TenantDetail);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/platform/tenants" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Tenants
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            <p className="text-gray-600 mt-1">slug: {tenant.slug}</p>
          </div>
          <div className="flex gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${TENANT_STATUS_CONFIG[tenant.status]?.color || 'bg-gray-100 text-gray-800'}`}>
              {TENANT_STATUS_CONFIG[tenant.status]?.label || tenant.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${onboardingConfig.color}`}>
              {onboardingConfig.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Tenant Info</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Created at:</span>
              <p>{new Date(tenant.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Updated at:</span>
              <p>{new Date(tenant.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Domains</h2>
          <div className="space-y-3">
            {tenant.domains.map((domain) => (
              <div key={domain.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{domain.domain}</p>
                  <p className="text-sm text-gray-600">{domain.type}</p>
                </div>
                {domain.is_primary && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Memberships</h2>
          <Button onClick={() => setShowInviteForm(!showInviteForm)}>
            {showInviteForm ? 'Cancel' : 'Invite Admin'}
          </Button>
        </div>

        {showInviteForm && (
          <InviteSchoolAdminForm tenantId={tenant.id} onSuccess={handleAdminInvited} />
        )}

        <div className="bg-white rounded-lg border overflow-hidden">
          {tenant.memberships.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No members yet. Invite a school admin to get started.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invited At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tenant.memberships.map((membership) => (
                  <tr key={membership.id}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {membership.user_profile?.full_name || 'User'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {membership.role?.role_name || 'Unknown Role'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${MEMBERSHIP_STATUS_CONFIG[membership.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {MEMBERSHIP_STATUS_CONFIG[membership.status]?.label || membership.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {membership.invited_at
                        ? new Date(membership.invited_at).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
