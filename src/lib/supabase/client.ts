import { createBrowserClient } from "@supabase/ssr";
import { config } from "@/config";

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    config.supabase.url,
    config.supabase.anonKey
  );
}
