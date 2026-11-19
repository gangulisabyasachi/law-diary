"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] text-center font-serif">
      <h1 className="text-3xl font-cinzel font-bold text-rose-600 mb-3">Chamber Registry Notice</h1>
      <p className="text-sm max-w-md text-[#555866] dark:text-[#f3eee3]/70 mb-6">
        An unexpected judicial ledger exception occurred while loading this page.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl border border-[#111111]/20 dark:border-[#f3eee3]/20 text-xs font-cinzel font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-[#d9541e] text-white text-xs font-cinzel font-bold hover:bg-[#bf4513] transition-all shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
