import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Forbidden</h1>
        <p className="text-gray-600 mb-6">
          Access to this resource is denied.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
