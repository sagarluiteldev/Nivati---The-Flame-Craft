"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-olive/10 text-olive rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-olive tracking-tight">
            An unexpected error occurred
          </h1>
          <p className="text-olive/70 text-lg font-sans">
            We apologize for the inconvenience. Something went wrong while crafting this page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3 bg-olive text-creme rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 text-base font-medium font-sans"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 border border-olive/20 text-olive rounded-full transition-all duration-300 hover:bg-olive/5 hover:border-olive/45 active:scale-95 text-base font-medium font-sans"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
