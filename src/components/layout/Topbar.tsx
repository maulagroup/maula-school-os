import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  title?: string;
  userEmail?: string;
  tenantName?: string;
}

export default function Topbar({ title, userEmail, tenantName }: TopbarProps) {
  return (
    <div className="h-full flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        {tenantName && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {tenantName}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {userEmail && <span className="text-sm text-gray-600">{userEmail}</span>}
        <form action={logout}>
          <Button variant="outline" size="sm" type="submit">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
