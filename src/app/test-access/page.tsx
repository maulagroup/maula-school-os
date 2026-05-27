import { createServerSupabaseClient } from '@/lib/supabase/server';
import { resolveUserAccess } from '@/lib/middleware/auth';
import { getRoleAwareRedirect } from '@/lib/middleware/route-access';

export const dynamic = 'force-dynamic';

export default async function TestAccessPage() {
  const supabase = await createServerSupabaseClient();
  const userAccess = await resolveUserAccess(supabase);
  const redirectTo = getRoleAwareRedirect(
    userAccess.isPlatformAdmin,
    userAccess.activeRoleCode,
    userAccess.hasValidMembership
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">DEBUG: User Access Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. User Access Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(userAccess, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Calculated Redirect</h2>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="text-lg"><strong>Redirect To:</strong> <span className="font-mono text-blue-700">{redirectTo}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Quick Checks</h2>
          <ul className="space-y-2">
            <li className={`flex items-center gap-2 ${userAccess.isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              <span className="font-semibold">Authenticated:</span> {userAccess.isAuthenticated ? '✅ Yes' : '❌ No'}
            </li>
            <li className={`flex items-center gap-2 ${userAccess.hasValidMembership ? 'text-green-600' : 'text-yellow-600'}`}>
              <span className="font-semibold">Has Valid Membership:</span> {userAccess.hasValidMembership ? '✅ Yes' : '⚠️ No'}
            </li>
            <li className={`flex items-center gap-2 ${userAccess.isPlatformAdmin ? 'text-purple-600' : 'text-gray-600'}`}>
              <span className="font-semibold">Is Platform Admin:</span> {userAccess.isPlatformAdmin ? '✅ Yes' : '❌ No'}
            </li>
            <li className="text-gray-700">
              <span className="font-semibold">Active Role Code:</span> <span className="font-mono">{userAccess.activeRoleCode || '❌ None'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
