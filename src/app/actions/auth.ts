'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
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
  const rawInput = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validation = loginSchema.safeParse(rawInput);

  if (!validation.success) {
    const firstError = validation.error.errors[0];
    return {
      success: false,
      error: firstError?.message || 'Input tidak valid',
    };
  }

  const { email, password } = validation.data;

  const supabase = await createServerSupabaseClient();
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

  const userAccess = await resolveUserAccess(supabase);
  let redirectTo = callbackUrl || '/';

  if (!callbackUrl || callbackUrl === '/' || callbackUrl === '/login') {
    redirectTo = getRoleAwareRedirect(
      userAccess.isPlatformAdmin,
      userAccess.activeRoleCode
    );
  }

  await logSecurityEvent('login_success', {
    email,
    userId: data.user?.id,
    isPlatformAdmin: userAccess.isPlatformAdmin,
  });

  return {
    success: true,
    redirectTo,
  };
}

export async function logout(): Promise<never> {
  const supabase = await createServerSupabaseClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    await logSecurityEvent('logout', {
      userId: session.user.id,
    });
  }

  await supabase.auth.signOut();
  redirect('/login');
}
