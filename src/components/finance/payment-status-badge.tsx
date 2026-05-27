import StatusBadge, { type StatusVariant } from '@/components/ui/status-badge';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<PaymentStatus, { label: string; variant: StatusVariant }> = {
  unpaid: { label: 'Belum Dibayar', variant: 'danger' },
  partial: { label: 'Sebagian', variant: 'warning' },
  paid: { label: 'Lunas', variant: 'success' },
  overdue: { label: 'Jatuh Tempo', variant: 'danger' },
};

export default function PaymentStatusBadge({ status, size }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];
  return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
}
