import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400 mb-6">Page not found</p>
        <Link
          href="/dashboard"
          className="px-6 py-2 bg-accent text-black rounded-lg font-medium"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
