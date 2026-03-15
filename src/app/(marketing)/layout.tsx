import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 tracking-tight">Kento</span>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center h-9 px-5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-all"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>
      <div className="pt-16">{children}</div>
    </div>
  );
}
