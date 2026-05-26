import type { NextRequest } from "next/server";
import type { Session } from "@supabase/supabase-js";

export interface AuthMiddlewareResult {
  session: Session | null;
  isAuthenticated: boolean;
}

export async function authMiddleware(request: NextRequest): Promise<AuthMiddlewareResult> {
  return {
    session: null,
    isAuthenticated: false,
  };
}
