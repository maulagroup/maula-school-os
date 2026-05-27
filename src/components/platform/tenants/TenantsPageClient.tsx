'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TenantTable from './TenantTable';
import CreateTenantForm from './CreateTenantForm';
import TenantEmptyState from './TenantEmptyState';
import { getTenants } from '@/app/actions/platform';
import type { TenantListItem } from './types';

interface TenantsPageClientProps {
  initialTenants: TenantListItem[];
}

export default function TenantsPageClient({ initialTenants }: TenantsPageClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [tenants, setTenants] = useState(initialTenants);

  const handleTenantCreated = async () => {
    setShowForm(false);
    const newTenants = await getTenants();
    setTenants(newTenants);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenant Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Tenant'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <CreateTenantForm
            onSuccess={handleTenantCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {tenants.length === 0 ? (
        <TenantEmptyState />
      ) : (
        <TenantTable tenants={tenants} />
      )}
    </div>
  );
}
