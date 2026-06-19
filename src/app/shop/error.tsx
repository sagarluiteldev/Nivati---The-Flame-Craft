"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ShopError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Shop error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-creme flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="space-y-3">
          <div className="w-14 h-14 bg-olive/10 text-olive rounded-full flex items-center justify-center mx-auto mb-4">
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-olive tracking-tight">
            Failed to Load Products
          </h1>
          <p className="text-olive/70 font-sans">
            We couldn&apos;t retrieve the products or collections. Please check your connection and try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3 bg-olive text-creme rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 text-base font-medium font-sans"
          >
            Retry Loading
          </button>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3 border border-olive/20 text-olive rounded-full transition-all duration-300 hover:bg-olive/5 hover:border-olive/45 active:scale-95 text-base font-medium font-sans"
          >
            Refresh Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
