import type { StatusVariant } from '@/components/ui/status-badge';
import type { AlertVariant } from '@/components/ui/alert';

export const STATUS_CONFIG: Record<string, { variant: StatusVariant; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'default', label: 'Inactive' },
  suspended: { variant: 'danger', label: 'Suspended' },
  pending: { variant: 'warning', label: 'Pending' },
  invited: { variant: 'info', label: 'Invited' },
  onboarding_complete: { variant: 'success', label: 'Onboarding Complete' },
  onboarding_incomplete: { variant: 'warning', label: 'Onboarding Incomplete' },
};

export const ROLE_CONFIG: Record<string, { variant: StatusVariant; label: string }> = {
  school_owner: { variant: 'success', label: 'School Owner' },
  school_admin: { variant: 'info', label: 'School Admin' },
  teacher: { variant: 'default', label: 'Teacher' },
  student: { variant: 'default', label: 'Student' },
  parent: { variant: 'default', label: 'Parent' },
  super_admin_platform: { variant: 'danger', label: 'Super Admin' },
  support_admin: { variant: 'warning', label: 'Support Admin' },
  finance_admin: { variant: 'info', label: 'Finance Admin' },
};

export const ALERT_CONFIG: Record<string, AlertVariant> = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
  info: 'info',
};
