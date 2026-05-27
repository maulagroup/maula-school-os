import Card from '@/components/ui/card';
import StatusBadge, { type StatusVariant } from '@/components/ui/status-badge';

export interface ProfileCardProps {
  name?: string;
  code?: string;
  role?: string;
  status?: string;
  statusVariant?: StatusVariant;
  avatar?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ProfileCard({
  name,
  code,
  role,
  status,
  statusVariant = 'default',
  avatar,
  children,
}: ProfileCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
          {avatar || (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {name && <h3 className="text-lg font-semibold text-secondary-900">{name}</h3>}
          {code && <p className="text-sm text-secondary-500">{code}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {role && (
              <span className="text-xs text-secondary-600 bg-secondary-100 px-2 py-1 rounded-full">
                {role}
              </span>
            )}
            {status && <StatusBadge variant={statusVariant}>{status}</StatusBadge>}
          </div>
        </div>
      </div>
      {children && <div className="mt-4 pt-4 border-t border-secondary-200">{children}</div>}
    </Card>
  );
}
