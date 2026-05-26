-- ========================================
-- MAULA SCHOOL OS — DATABASE SCHEMA (REVISION)
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- ENUMS
-- ========================================
CREATE TYPE tenant_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE membership_status AS ENUM ('active', 'inactive', 'pending', 'invited');
CREATE TYPE role_scope AS ENUM ('platform', 'tenant');
CREATE TYPE domain_type AS ENUM ('subdomain', 'custom');

-- ========================================
-- TABLE: tenants
-- ========================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    status tenant_status NOT NULL DEFAULT 'active',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- ========================================
-- TABLE: domains
-- ========================================
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    domain VARCHAR(255) UNIQUE NOT NULL,
    type domain_type NOT NULL DEFAULT 'subdomain',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_domain_format CHECK (domain ~ '^[a-z0-9]+(?:[-.][a-z0-9]+)*\.[a-z]{2,}$' OR domain ~ '^[a-z0-9]+\.localhost$')
);

-- ========================================
-- TABLE: roles
-- ========================================
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_code VARCHAR(100) NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    role_scope role_scope NOT NULL DEFAULT 'tenant',
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    parent_role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_role_code_per_scope UNIQUE (role_code, role_scope)
);

-- ========================================
-- TABLE: users_profile
-- ========================================
CREATE TABLE users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLE: memberships
-- ========================================
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    status membership_status NOT NULL DEFAULT 'active',
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    invited_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, tenant_id)
);

-- ========================================
-- UNIQUE CONSTRAINT: 1 primary domain per tenant
-- ========================================
CREATE UNIQUE INDEX idx_unique_primary_domain_per_tenant 
ON domains(tenant_id) 
WHERE is_primary = TRUE AND deleted_at IS NULL;

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_deleted_at ON tenants(deleted_at);
CREATE INDEX idx_tenants_created_by ON tenants(created_by);
CREATE INDEX idx_domains_tenant_id ON domains(tenant_id);
CREATE INDEX idx_domains_domain ON domains(domain);
CREATE INDEX idx_domains_is_primary ON domains(is_primary);
CREATE INDEX idx_domains_deleted_at ON domains(deleted_at);
CREATE INDEX idx_domains_type ON domains(type);
CREATE INDEX idx_roles_role_code ON roles(role_code);
CREATE INDEX idx_roles_role_scope ON roles(role_scope);
CREATE INDEX idx_roles_parent_role_id ON roles(parent_role_id);
CREATE INDEX idx_roles_is_system ON roles(is_system);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_tenant_id ON memberships(tenant_id);
CREATE INDEX idx_memberships_role_id ON memberships(role_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_deleted_at ON memberships(deleted_at);
CREATE INDEX idx_memberships_invited_by ON memberships(invited_by);

-- ========================================
-- SEED DATA: PLATFORM ROLES
-- ========================================
INSERT INTO roles (role_code, role_name, role_scope, description, is_system) VALUES
('super_admin_platform', 'Super Admin Platform', 'platform', 'Full access to all platform features', true),
('support_admin', 'Support Admin', 'platform', 'Platform support and assistance', true),
('finance_admin', 'Finance Admin', 'platform', 'Platform financial management', true);

-- ========================================
-- SEED DATA: TENANT ROLES
-- ========================================
INSERT INTO roles (role_code, role_name, role_scope, description, is_system) VALUES
('school_owner', 'School Owner', 'tenant', 'Owner of the school/tenant', true),
('school_admin', 'School Admin', 'tenant', 'School administrative access', false),
('teacher', 'Teacher', 'tenant', 'Teacher role', false),
('student', 'Student', 'tenant', 'Student role', false),
('parent', 'Parent', 'tenant', 'Parent/guardian role', false);

-- ========================================
-- TRIGGERS: updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
