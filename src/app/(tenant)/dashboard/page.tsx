export default function TenantDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">School Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Students</h3>
          <p className="text-gray-600">Content placeholder</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Teachers</h3>
          <p className="text-gray-600">Content placeholder</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">PPDB</h3>
          <p className="text-gray-600">Content placeholder</p>
        </div>
      </div>
    </div>
  );
}
