import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

interface AdminRecord {
  user_id: string;
  email: string | null;
  role: string;
}

type AuthStatus = "missing-env" | "signed-out" | "not-admin" | "ready";
type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export interface AdminSessionResult {
  status: AuthStatus;
  user: User | null;
  adminRecord: AdminRecord | null;
  supabase: SupabaseServerClient | null;
}

export interface ReadyAdminSession {
  status: "ready";
  user: User;
  adminRecord: AdminRecord;
  supabase: SupabaseServerClient;
}

export async function getAdminSession(): Promise<AdminSessionResult> {
  if (!hasSupabaseEnv()) {
    return {
      status: "missing-env",
      user: null,
      adminRecord: null,
      supabase: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "signed-out",
      user: null,
      adminRecord: null,
      supabase,
    };
  }

  const { data: adminRecord, error } = await supabase
    .from("admin_users")
    .select("user_id, email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !adminRecord) {
    return {
      status: "not-admin",
      user,
      adminRecord: null,
      supabase,
    };
  }

  return {
    status: "ready",
    user,
    adminRecord,
    supabase,
  };
}

export async function requireAdminSession(): Promise<ReadyAdminSession> {
  const session = await getAdminSession();

  if (
    session.status === "ready" &&
    session.user &&
    session.adminRecord &&
    session.supabase
  ) {
    return session as ReadyAdminSession;
  }

  if (session.status === "not-admin") {
    redirect("/admin/login?error=unauthorized");
  }

  redirect("/admin/login");
}
