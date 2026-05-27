'use client';

import { TENANT_STATUS_CONFIG } from './types';

interface TenantStatusBadgeProps {
  status: string;
}

export default function TenantStatusBadge({ status }: TenantStatusBadgeProps) {
  const config = TENANT_STATUS_CONFIG[status] || TENANT_STATUS_CONFIG.inactive;

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}
