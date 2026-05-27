import StatusBadge from '@/components/ui/status-badge';

export interface Notification {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: string;
  status: string;
  created_at: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const typeColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  attendance: 'success',
  lms: 'primary',
  grading: 'info',
  onboarding: 'warning',
  system: 'secondary',
  announcement: 'info',
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const isUnread = notification.status === 'unread';
  const typeConfig = typeColors[notification.type] || 'secondary';

  return (
    <div 
      className={`p-4 border-b border-secondary-100 cursor-pointer transition-colors ${
        isUnread ? 'bg-primary-50' : 'hover:bg-secondary-50'
      }`}
      onClick={() => onMarkAsRead?.(notification.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-secondary-900">{notification.title}</h4>
            <StatusBadge variant={typeConfig} size="sm">
              {notification.type}
            </StatusBadge>
            {isUnread && (
              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
            )}
          </div>
          {notification.content && (
            <p className="text-sm text-secondary-600 mb-2">{notification.content}</p>
          )}
          <p className="text-xs text-secondary-400">
            {new Date(notification.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
