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
    try {
      fetch("/api/admin/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: "fatal",
          category: "system",
          message: error.message || "Unhandled client application crash",
          details: error.stack || (error.digest ? `Crash Digest ID: ${error.digest}` : "Client React execution failure"),
          source: "client/ErrorBoundary",
          path: typeof window !== "undefined" ? window.location.pathname : "/app",
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking fail-safe
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f3eee3] dark:bg-[#111111] text-[#111111] dark:text-[#f3eee3] text-center font-serif">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#111111] dark:text-[#f3eee3] mb-2">
        Chamber Registry Notice
      </h1>
      <p className="text-xs sm:text-sm max-w-md text-[#111111]/70 dark:text-[#f3eee3]/70 font-serif italic mb-6">
        An unexpected application exception occurred. Our diagnostic audit ledger has registered this incident.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-2xl border border-[#111111]/15 dark:border-[#f3eee3]/20 bg-white dark:bg-[#181818] text-xs font-cinzel font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-2xl bg-[#d9541e] text-white text-xs font-cinzel font-bold hover:bg-[#bf4513] transition-all shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
