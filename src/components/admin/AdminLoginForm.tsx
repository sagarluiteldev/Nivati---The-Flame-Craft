"use client";

import { useState } from "react";
import { ArrowPathIcon as LoaderCircle, LockClosedIcon as LockKeyhole, ArrowRightOnRectangleIcon as LogOut } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

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
    <section className="w-full max-w-md rounded-[32px] border border-olive/10 bg-creme/92 p-8 shadow-2xl shadow-olive/10 backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-olive text-creme">
        <LockKeyhole className="h-6 w-6" />
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.35em] text-olive/45">Secure Access</p>
      <h1 className="mt-3 text-4xl font-serif text-olive">Sign In</h1>
      <p className="mt-3 text-sm leading-6 text-olive/70">
        Enter your credentials to access the Nivati Management System. Only authorized
        administrative accounts may proceed.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-olive/45">
            Email Address
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@nivati.com"
            required
            className="w-full rounded-2xl border border-olive/15 bg-creme px-4 py-3.5 text-olive outline-none transition-all placeholder:text-olive/25 focus:border-olive/40 focus:ring-1 focus:ring-olive/10"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-olive/45">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-2xl border border-olive/15 bg-creme px-4 py-3.5 text-olive outline-none transition-all placeholder:text-olive/25 focus:border-olive/40 focus:ring-1 focus:ring-olive/10"
          />
        </label>


        {errorMessage ? (
          <div className="rounded-2xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm leading-6 text-olive/80">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-olive px-5 py-3.5 text-sm tracking-[0.24em] text-creme transition-transform hover:scale-[1.01] hover:bg-olive/95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          Sign In
        </button>
      </form>

      {canSignOut ? (
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="mt-5 inline-flex items-center gap-2 text-sm text-olive/60 transition-colors hover:text-olive disabled:opacity-70"
        >
          {isSigningOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Sign out current account
        </button>
      ) : null}
    </section>
  );
}
