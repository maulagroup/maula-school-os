/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { config } from "@/config";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * WARNING: SERVICE ROLE CLIENT - USE WITH EXTREME CAUTION
 * 
 * This client has full administrative access to your database.
 * It bypasses all Row Level Security (RLS) policies.
 * 
 * ONLY USE THIS:
 * - In server-side trusted environments (Server Components, Route Handlers, Middleware)
 * - For administrative tasks that cannot be done with RLS
 * - Never expose this to client-side code
 * - Never use in public routes without proper validation
 */
export async function createServiceSupabaseClient() {
  return createSupabaseClient(
    config.supabase.url,
    config.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
