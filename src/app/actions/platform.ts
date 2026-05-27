'use server';

import { redirect } from 'next/navigation';
import {
  createServiceSupabaseClient,
  createServerSupabaseClient,
} from '@/lib/supabase/server';
import { resolveUserAccess } from '@/lib/middleware/auth';
import {
  createTenantSchema,
  type CreateTenantInput,
  normalizeSlug,
  normalizeDomain,
  validateSlug,
  validateDomain,
} from '@/lib/tenant/validation';
import { RESERVED_SLUGS } from '@/lib/tenant/constants';

async function logAuditEvent({
  action,
  tenantId,
  createdBy,
  details,
}: {
  action: string;
  tenantId?: string;
  createdBy: string;
  details?: Record<string, unknown>;
}) {
  console.log('[Audit]', {
    action,
    tenantId,
    createdBy,
    details,
    timestamp: new Date().toISOString(),
    source: 'platform',
  });
}

export async function createTenant(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const userAccess = await resolveUserAccess(supabase);

  if (!userAccess.isPlatformAdmin) {
    throw new Error('Unauthorized: Only platform admins can create tenants');
  }

  const input: CreateTenantInput = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    domain: formData.get('domain') as string,
  };

  const validation = createTenantSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  const normalizedSlug = normalizeSlug(input.slug);
  const normalizedDomain = normalizeDomain(input.domain);

  if (RESERVED_SLUGS.includes(normalizedSlug)) {
    return {
      success: false,
      error: 'This slug is not available',
    };
  }

  const slugValidation = validateSlug(normalizedSlug);
  if (!slugValidation.valid) {
    return {
      success: false,
      error: slugValidation.error,
    };
  }

  const domainValidation = validateDomain(normalizedDomain);
  if (!domainValidation.valid) {
    return {
      success: false,
      error: domainValidation.error,
    };
  }

  const serviceSupabase = await createServiceSupabaseClient();
  const userId = userAccess.currentPlatformMembership?.userId || 'unknown';

  try {
    const { data: tenant, error: tenantError } = await serviceSupabase
      .from('tenants')
      .insert({
        name: input.name,
        slug: normalizedSlug,
        status: 'active',
        created_by: userId,
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      await logAuditEvent({
        action: 'tenant_creation_failed',
        createdBy: userId,
        details: { name: input.name, slug: normalizedSlug, error: tenantError?.message },
      });

      return {
        success: false,
        error: 'Failed to create tenant',
      };
    }

    const { error: domainError } = await serviceSupabase
      .from('domains')
      .insert({
        tenant_id: tenant.id,
        domain: normalizedDomain,
        type: 'subdomain',
        is_primary: true,
      });

    if (domainError) {
      await serviceSupabase.from('tenants').delete().eq('id', tenant.id);

      await logAuditEvent({
        action: 'domain_creation_failed',
        tenantId: tenant.id,
        createdBy: userId,
        details: { domain: normalizedDomain, error: domainError.message },
      });

      return {
        success: false,
        error: 'Failed to create tenant',
      };
    }

    await logAuditEvent({
      action: 'tenant_created',
      tenantId: tenant.id,
      createdBy: userId,
      details: {
        name: input.name,
        slug: normalizedSlug,
        domain: normalizedDomain,
      },
    });

    return {
      success: true,
      tenantId: tenant.id,
    };
  } catch (error) {
    console.error('Tenant creation failed:', error);

    await logAuditEvent({
      action: 'tenant_creation_error',
      createdBy: userId,
      details: { name: input.name, slug: normalizedSlug },
    });

    return {
      success: false,
      error: 'Failed to create tenant',
    };
  }
}

export async function getTenants() {
  const supabase = await createServerSupabaseClient();
  const userAccess = await resolveUserAccess(supabase);

  if (!userAccess.isPlatformAdmin) {
    redirect('/forbidden');
  }

  const { data: tenants } = await supabase
    .from('tenants')
    .select(`
      id,
      name,
      slug,
      status,
      created_at,
      domains (
        domain,
        is_primary
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return tenants || [];
}

export async function getTenantById(tenantId: string) {
  const supabase = await createServerSupabaseClient();
  const userAccess = await resolveUserAccess(supabase);

  if (!userAccess.isPlatformAdmin) {
    redirect('/forbidden');
  }

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select(`
      id,
      name,
      slug,
      status,
      metadata,
      created_at,
      updated_at,
      domains (
        id,
        domain,
        type,
        is_primary,
        verified_at
      ),
      memberships (
        id,
        user_id,
        role_id,
        status,
        invited_by,
        invited_at,
        role: roles (
          id,
          role_code,
          role_name
        ),
        user_profile: users_profile (
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('id', tenantId)
    .is('deleted_at', null)
    .single();

  if (error || !tenant) {
    throw new Error('Tenant not found');
  }

  return tenant;
}

export async function inviteSchoolAdmin(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const userAccess = await resolveUserAccess(supabase);

  if (!userAccess.isPlatformAdmin) {
    return {
      success: false,
      error: 'Unauthorized: Only platform admins can invite school admins',
    };
  }

  const tenantId = formData.get('tenantId') as string;
  const email = formData.get('email') as string;

  if (!tenantId || !email) {
    return {
      success: false,
      error: 'Tenant ID and email are required',
    };
  }

  const serviceSupabase = await createServiceSupabaseClient();
  const userId = userAccess.currentPlatformMembership?.userId || 'unknown';

  try {
    const { data: schoolAdminRole, error: roleError } = await serviceSupabase
      .from('roles')
      .select('id')
      .eq('role_code', 'school_admin')
      .eq('role_scope', 'tenant')
      .single();

    if (roleError || !schoolAdminRole) {
      return {
        success: false,
        error: 'Failed to find school admin role',
      };
    }

    const { data: tenant, error: tenantError } = await serviceSupabase
      .from('tenants')
      .select('id, name')
      .eq('id', tenantId)
      .is('deleted_at', null)
      .single();

    if (tenantError || !tenant) {
      return {
        success: false,
        error: 'Tenant not found',
      };
    }

    const { data: existingUser, error: userError } = await serviceSupabase.auth.admin.listUsers();
    let targetUserId: string | null = null;

    const userByEmail = existingUser?.users.find(u => u.email === email);
    
    if (userByEmail) {
      targetUserId = userByEmail.id;

      const { data: existingProfile } = await serviceSupabase
        .from('users_profile')
        .select('id')
        .eq('id', targetUserId)
        .single();

      if (!existingProfile) {
        await serviceSupabase
          .from('users_profile')
          .insert({
            id: targetUserId,
            full_name: email.split('@')[0],
          });
      }
    } else {
      const { data: newUser, error: createUserError } = await serviceSupabase.auth.admin.createUser({
        email,
        email_confirm: false,
      });

      if (createUserError || !newUser.user) {
        return {
          success: false,
          error: 'Failed to create user',
        };
      }

      targetUserId = newUser.user.id;

      await serviceSupabase
        .from('users_profile')
        .insert({
          id: targetUserId,
          full_name: email.split('@')[0],
        });
    }

    const { data: existingMembership } = await serviceSupabase
      .from('memberships')
      .select('id, status')
      .eq('user_id', targetUserId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();

    if (existingMembership) {
      return {
        success: false,
        error: 'User already has a membership for this tenant',
      };
    }

    const { data: membership, error: membershipError } = await serviceSupabase
      .from('memberships')
      .insert({
        user_id: targetUserId,
        tenant_id: tenantId,
        role_id: schoolAdminRole.id,
        status: 'invited',
        invited_by: userId,
        invited_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (membershipError || !membership) {
      return {
        success: false,
        error: 'Failed to create membership',
      };
    }

    await logAuditEvent({
      action: 'school_admin_invited',
      tenantId,
      createdBy: userId,
      details: {
        email,
        membershipId: membership.id,
      },
    });

    console.log('[Invitation] School admin invited (email provider not implemented yet):', { email, tenantId, membershipId: membership.id });

    return {
      success: true,
      membershipId: membership.id,
    };
  } catch (error) {
    console.error('Invite school admin failed:', error);
    return {
      success: false,
      error: 'Failed to invite school admin',
    };
  }
}
