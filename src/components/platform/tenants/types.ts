export type TenantOnboardingStatus = 'onboarding_incomplete' | 'waiting_admin_activation' | 'onboarding_complete';

export interface TenantListItem {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  domains: Array<{
    domain: string;
    is_primary: boolean;
  }>;
}

export interface TenantDetail {
  id: string;
  name: string;
  slug: string;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  domains: Array<{
    id: string;
    domain: string;
    type: string;
    is_primary: boolean;
    verified_at: string | null;
  }>;
  memberships: Array<{
    id: string;
    user_id: string;
    role_id: string;
    status: string;
    invited_by: string | null;
    invited_at: string | null;
    role: {
      id: string;
      role_code: string;
      role_name: string;
    };
    user_profile: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }>;
}

export interface MembershipStatusConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export const MEMBERSHIP_STATUS_CONFIG: MembershipStatusConfig = {
  invited: {
    label: 'Invited',
    color: 'bg-yellow-100 text-yellow-800',
  },
  active: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-gray-100 text-gray-800',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-red-100 text-red-800',
  },
  pending: {
    label: 'Pending',
    color: 'bg-blue-100 text-blue-800',
  },
};

export const ONBOARDING_STATUS_CONFIG: { [key in TenantOnboardingStatus]: { label: string; color: string } } = {
  onboarding_incomplete: {
    label: 'Onboarding Incomplete',
    color: 'bg-orange-100 text-orange-800',
  },
  waiting_admin_activation: {
    label: 'Waiting Admin Activation',
    color: 'bg-yellow-100 text-yellow-800',
  },
  onboarding_complete: {
    label: 'Onboarding Complete',
    color: 'bg-green-100 text-green-800',
  },
};

export interface TenantStatusConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export const TENANT_STATUS_CONFIG: TenantStatusConfig = {
  active: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-gray-100 text-gray-800',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-red-100 text-red-800',
  },
};
