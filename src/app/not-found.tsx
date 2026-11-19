import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] text-center font-serif">
      <h1 className="text-4xl font-cinzel font-bold text-[#d9541e] mb-3">404 — Matter Not Found</h1>
      <p className="text-sm max-w-md text-[#555866] dark:text-[#f3eee3]/70 mb-6">
        The judicial docket or page you requested does not exist in the chamber registry.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold hover:bg-[#bf4513] transition-all shadow-md"
      >
        Return to Chamber Dashboard
      </Link>
    </div>
  );
}
