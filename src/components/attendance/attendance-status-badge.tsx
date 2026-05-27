import StatusBadge, { type StatusVariant } from '@/components/ui/status-badge';
import type { AttendanceStatus } from '@/types/database';

export interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_VARIANTS: Record<AttendanceStatus, StatusVariant> = {
  present: 'success',
  absent: 'danger',
  sick: 'warning',
  permission: 'info',
  late: 'warning',
};

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Hadir',
  absent: 'Tidak Hadir',
  sick: 'Sakit',
  permission: 'Izin',
  late: 'Terlambat',
};

export default function AttendanceStatusBadge({ status, size = 'md' }: AttendanceStatusBadgeProps) {
  return (
    <StatusBadge variant={STATUS_VARIANTS[status]} size={size}>
      {STATUS_LABELS[status]}
    </StatusBadge>
  );
}
