'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createTenant } from '@/app/actions/platform';

interface CreateTenantFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateTenantForm({ onSuccess, onCancel }: CreateTenantFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const result = await createTenant(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setLoading(false);
      onSuccess?.();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Tenant</h2>
      
      <form action={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium mb-2">School Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Sekolah"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="nama-sekolah"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Domain/Subdomain</label>
          <input
            type="text"
            name="domain"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="nama-sekolah.maulaschool.id"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Tenant'}
          </Button>
        </div>
      </form>
    </div>
  );
}
