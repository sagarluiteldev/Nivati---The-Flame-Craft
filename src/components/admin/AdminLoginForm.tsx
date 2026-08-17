"use client";

import { useState } from "react";
import { 
  ArrowPathIcon as LoaderCircle, 
  LockClosedIcon, 
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon as LogOut,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface Props {
  defaultEmail?: string;
  message?: string;
  canSignOut?: boolean;
}

export default function AdminLoginForm({
  defaultEmail = "",
  message,
  canSignOut = false,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(message ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in to the admin dashboard.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setErrorMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign out of the current session.";
      setErrorMessage(message);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      
      {/* 1. FLOATING ORIGINAL NIVATI LOGO (Matches Reference Layout) */}
      <div className="mb-6 sm:mb-8 flex flex-col items-center">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white p-2.5 shadow-md shadow-[#283322]/10 border border-[#e3e8e2] transition-transform hover:scale-105">
          <img 
            src="/images/logo.png" 
            alt="Nivati Logo" 
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* 2. AUTHENTICATION CARD */}
      <div className="w-full rounded-3xl sm:rounded-[32px] border border-[#e3e8e2] bg-white p-6 sm:p-9 shadow-xl shadow-[#283322]/5 text-center">
        
        {/* Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#222a1d] tracking-tight">
          Welcome Back
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#222a1d]/50 font-normal">
          Enter your credentials to access your account.
        </p>

        {/* Login Form */}
        <form className="mt-7 sm:mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div className="relative text-left">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <EnvelopeIcon className="h-4.5 w-4.5 text-[#283322]/50" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-2xl border border-[#e3e8e2] bg-[#fbfdfa] pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none transition-all focus:border-[#283322]/50 focus:bg-white focus:ring-2 focus:ring-[#283322]/10"
            />
          </div>

          {/* Password Input */}
          <div className="relative text-left">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <LockClosedIcon className="h-4.5 w-4.5 text-[#283322]/50" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-2xl border border-[#e3e8e2] bg-[#fbfdfa] pl-11 pr-11 py-3 sm:py-3.5 text-xs sm:text-sm text-[#222a1d] placeholder:text-[#222a1d]/35 outline-none transition-all focus:border-[#283322]/50 focus:bg-white focus:ring-2 focus:ring-[#283322]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#222a1d]/40 hover:text-[#222a1d] transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Error Message Pill */}
          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-2.5 text-xs text-red-700 text-left animate-fade-in font-medium">
              {errorMessage}
            </div>
          )}

          {/* Primary Website Green Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#283322] hover:bg-[#34422c] py-3.5 text-sm font-bold text-white shadow-md shadow-[#283322]/20 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            <span>Sign In</span>
          </button>
        </form>

        {/* Sign Out Action (If authenticated with non-admin account) */}
        {canSignOut && (
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-70 cursor-pointer"
          >
            {isSigningOut ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
            <span>Sign out of current account</span>
          </button>
        )}

      </div>

      {/* 3. FOOTER LINKS BELOW CARD */}
      <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2 text-center text-xs text-[#222a1d]/45">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 font-medium hover:text-[#283322] transition-colors"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          <span>Return to Nivati Storefront</span>
        </Link>
      </div>

    </div>
  );
}
