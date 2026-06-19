"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Admin portal error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md w-full space-y-6 bg-neutral-800 p-8 rounded-2xl border border-neutral-700 shadow-2xl">
        <div className="space-y-3">
          <div className="w-14 h-14 bg-red-950 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/50">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Portal Error
          </h1>
          <p className="text-neutral-400 text-sm font-mono bg-neutral-900/80 p-3 rounded-lg overflow-x-auto text-left max-h-32">
            {error.message || "An unexpected error occurred inside the dashboard."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 bg-neutral-100 text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 transition-colors duration-250 text-sm"
          >
            Retry Action
          </button>
          <Link
            href="/admin"
            className="w-full sm:w-auto px-6 py-2.5 bg-neutral-700 text-neutral-200 font-medium rounded-lg hover:bg-neutral-600 transition-colors duration-250 text-sm border border-neutral-600"
          >
            Dashboard Home
          </Link>
        </div>
      </div>
    </div>
  );
}
