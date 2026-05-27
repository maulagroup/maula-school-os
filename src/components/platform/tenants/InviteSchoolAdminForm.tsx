'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { inviteSchoolAdmin } from '@/app/actions/platform';

interface InviteSchoolAdminFormProps {
  tenantId: string;
  onSuccess: () => void;
}

export default function InviteSchoolAdminForm({ tenantId, onSuccess }: InviteSchoolAdminFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set('tenantId', tenantId);
    formData.set('email', email);

    const result = await inviteSchoolAdmin(formData);

    if (result.success) {
      setEmail('');
      onSuccess();
    } else {
      setError(result.error ?? null);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Invite School Admin</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@school.com"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Inviting...' : 'Invite Admin'}
        </Button>
      </form>
    </div>
  );
}
