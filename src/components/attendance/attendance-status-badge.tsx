import StatusBadge from '@/components/ui/status-badge';
import type { AttendanceStatus } from '@/types/database';

export interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
}

const STATUS_VARIANTS: Record<AttendanceStatus, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
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

export default function AttendanceStatusBadge({ status }: AttendanceStatusBadgeProps) {
  return (
    <StatusBadge variant={STATUS_VARIANTS[status]}>
      {STATUS_LABELS[status]}
    </StatusBadge>
  );
}
