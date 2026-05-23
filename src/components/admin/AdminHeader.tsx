"use client";

import { ArrowRightOnRectangleIcon as LogOut, UserCircleIcon as UserCircle } from "@heroicons/react/24/outline";

interface Props {
  email: string;
  onSignOut: () => void;
}

export default function AdminHeader({ email, onSignOut }: Props) {
  return (
    <header className="flex flex-col gap-6 rounded-xl border border-olive/10 bg-creme/80 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-olive/50">
          Management Console
        </p>
        <h1 className="mt-2 text-3xl font-serif text-olive md:text-4xl">
          Nivati Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-olive/10 bg-creme/50 px-4 py-2 text-sm text-olive/80">
          <UserCircle className="h-4 w-4" />
          <span className="max-w-[150px] truncate">{email}</span>
        </div>
        
        <button
          onClick={onSignOut}
          className="group flex h-11 w-11 items-center justify-center rounded-lg border border-olive/15 bg-creme text-olive transition-all hover:bg-olive hover:text-creme"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>
    </header>
  );
}
