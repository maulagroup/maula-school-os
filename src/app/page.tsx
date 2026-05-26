export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Maula School OS</h1>
        <p className="text-lg text-gray-600 mb-8">Foundation Bootstrap Complete</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Architecture Ready</h3>
            <p className="text-sm text-gray-500">Multi-tenant, hostname-based resolution</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Auth Ready</h3>
            <p className="text-sm text-gray-500">Supabase SSR integration</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">RLS Ready</h3>
            <p className="text-sm text-gray-500">PostgreSQL Row Level Security</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Scalable</h3>
            <p className="text-sm text-gray-500">Clean folder structure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
