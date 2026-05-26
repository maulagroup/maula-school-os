import { redirect } from 'next/navigation';
import { getAuthContext } from '@/lib/auth/server';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authContext = await getAuthContext();

  if (!authContext) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
