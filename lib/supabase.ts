import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as typeof globalThis & {
  supabaseClient?: SupabaseClient;
};

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  if (!globalForSupabase.supabaseClient) {
    globalForSupabase.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return globalForSupabase.supabaseClient;
}
