'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { config } from '@/config';
import { loginSchema } from '@/lib/auth/schemas';
import type { AuthActionResult } from '@/lib/auth/types';
import { getRoleAwareRedirect } from '@/lib/middleware/route-access';
import { resolveUserAccess } from '@/lib/middleware/auth';

async function logSecurityEvent(event: string, metadata: Record<string, unknown>) {
  console.log(`[AUTH SECURITY] ${event}`, metadata);
}

export async function login(
  formData: FormData,
  callbackUrl?: string | null
): Promise<AuthActionResult> {
  console.log('[login action] Starting login process');
  
  const rawInput = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validation = loginSchema.safeParse(rawInput);

  if (!validation.success) {
    const firstError = validation.error.errors[0];
    console.log('[login action] Validation failed:', firstError);
    return {
      success: false,
      error: firstError?.message || 'Input tidak valid',
    };
  }

  const { email, password } = validation.data;
  console.log('[login action] Attempting sign in for:', email);

  const cookieStore = await cookies();
  const supabase = createServerClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error: authError, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  await logSecurityEvent('login_attempt', {
    email,
    success: !authError,
    userId: data.user?.id,
  });

  if (authError) {
    console.log('[login action] Auth error:', authError);
    let errorMessage = 'Email atau password salah';
    
    if (authError.message.includes('Invalid login credentials')) {
      errorMessage = 'Email atau password salah';
    } else if (authError.message.includes('Email not confirmed')) {
      errorMessage = 'Email belum dikonfirmasi';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }

  console.log('[login action] Sign in successful, resolving user access');
  const userAccess = await resolveUserAccess(supabase);
  console.log('[login action] User access resolved:', userAccess);
  
  let redirectTo = callbackUrl || '/';
  console.log('[login action] Initial redirectTo:', redirectTo);

  if (!callbackUrl || callbackUrl === '/' || callbackUrl === '/login') {
    redirectTo = getRoleAwareRedirect(
      userAccess.isPlatformAdmin,
      userAccess.activeRoleCode,
      userAccess.hasValidMembership
    );
  }
  
  console.log('[login action] Final redirectTo:', redirectTo);

  await logSecurityEvent('login_success', {
    email,
    userId: data.user?.id,
    isPlatformAdmin: userAccess.isPlatformAdmin,
    redirectTo,
  });

  return {
    success: true,
    redirectTo,
  };
}

export async function logout(): Promise<never> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    await logSecurityEvent('logout', {
      userId: session.user.id,
    });
  }

  await supabase.auth.signOut();
  redirect('/login');
}
