import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200 mb-6 leading-none">404</p>
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
