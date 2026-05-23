import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

let publicClient: SupabaseClient | null = null;

export function getSupabasePublicClient() {
  if (!publicClient) {
    const { url, anonKey } = getSupabaseEnv();

    publicClient = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return publicClient;
}
