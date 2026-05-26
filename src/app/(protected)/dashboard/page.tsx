import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { getAuthContext } from '@/lib/auth/server';

export default async function DashboardPage() {
  const authContext = await getAuthContext();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <p className="text-gray-700">
            Welcome, {authContext?.user.email}!
          </p>
        </div>

        <form action={logout}>
          <Button variant="outline" type="submit">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
