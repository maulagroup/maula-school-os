-- ========================================
-- MAULA SCHOOL OS — RLS FOUNDATION (REVISION)
-- ========================================

-- ========================================
-- HELPER SQL FUNCTIONS
-- ========================================

-- Mendapatkan current user profile
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS TABLE (
  id UUID,
  full_name VARCHAR(255),
  avatar_url TEXT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT id, full_name, avatar_url
  FROM users_profile
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql STABLE;

-- Cek apakah user adalah platform admin
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role_code VARCHAR(100);
BEGIN
  SELECT r.role_code INTO v_role_code
  FROM memberships m
  JOIN roles r ON m.role_id = r.id
  WHERE m.user_id = auth.uid()
    AND m.status = 'active'
    AND m.deleted_at IS NULL
    AND r.role_scope = 'platform'
    AND r.role_code IN ('super_admin_platform', 'support_admin', 'finance_admin');
  
  RETURN v_role_code IS NOT NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Cek apakah user adalah tenant admin di tenant tertentu
CREATE OR REPLACE FUNCTION is_tenant_admin(p_tenant_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  IF is_platform_admin() THEN
    RETURN TRUE;
  END IF;

  SELECT EXISTS(
    SELECT 1
    FROM memberships m
    JOIN roles r ON m.role_id = r.id
    WHERE m.user_id = auth.uid()
      AND m.tenant_id = p_tenant_id
      AND m.status = 'active'
      AND m.deleted_at IS NULL
      AND r.role_code IN ('school_owner', 'school_admin')
  ) INTO v_is_admin;
  
  RETURN v_is_admin;
END;
$$ LANGUAGE plpgsql STABLE;

-- Cek apakah user memiliki akses ke tenant tertentu
CREATE OR REPLACE FUNCTION has_tenant_access(p_tenant_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_access BOOLEAN;
BEGIN
  IF is_platform_admin() THEN
    RETURN TRUE;
  END IF;

  SELECT EXISTS(
    SELECT 1
    FROM memberships
    WHERE user_id = auth.uid()
      AND tenant_id = p_tenant_id
      AND status = 'active'
      AND deleted_at IS NULL
  ) INTO v_has_access;
  
  RETURN v_has_access;
END;
$$ LANGUAGE plpgsql STABLE;

-- Cek apakah user memiliki role tertentu di tenant tertentu
CREATE OR REPLACE FUNCTION has_role(p_tenant_id UUID, p_role_code TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_role BOOLEAN;
BEGIN
  IF is_platform_admin() THEN
    RETURN TRUE;
  END IF;

  SELECT EXISTS(
    SELECT 1
    FROM memberships m
    JOIN roles r ON m.role_id = r.id
    WHERE m.user_id = auth.uid()
      AND m.tenant_id = p_tenant_id
      AND m.status = 'active'
      AND m.deleted_at IS NULL
      AND r.role_code = p_role_code
  ) INTO v_has_role;
  
  RETURN v_has_role;
END;
$$ LANGUAGE plpgsql STABLE;

-- Cek apakah user memiliki salah satu role di tenant tertentu
CREATE OR REPLACE FUNCTION has_any_role(p_tenant_id UUID, p_role_codes TEXT[])
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_role BOOLEAN;
BEGIN
  IF is_platform_admin() THEN
    RETURN TRUE;
  END IF;

  SELECT EXISTS(
    SELECT 1
    FROM memberships m
    JOIN roles r ON m.role_id = r.id
    WHERE m.user_id = auth.uid()
      AND m.tenant_id = p_tenant_id
      AND m.status = 'active'
      AND m.deleted_at IS NULL
      AND r.role_code = ANY(p_role_codes)
  ) INTO v_has_role;
  
  RETURN v_has_role;
END;
$$ LANGUAGE plpgsql STABLE;

-- ========================================
-- ENABLE RLS
-- ========================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLICY: users_profile
-- ========================================
CREATE POLICY "Users can read their own profile"
ON users_profile
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON users_profile
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ========================================
-- POLICY: memberships
-- ========================================
CREATE POLICY "Memberships are visible to tenant members or platform admins"
ON memberships
FOR SELECT
USING (
  is_platform_admin() 
  OR has_tenant_access(tenant_id)
);

-- ========================================
-- POLICY: tenants
-- ========================================
CREATE POLICY "Tenants are visible to members or platform admins"
ON tenants
FOR SELECT
USING (has_tenant_access(id));

-- ========================================
-- POLICY: domains
-- ========================================
CREATE POLICY "Domains are visible to tenant members or platform admins"
ON domains
FOR SELECT
USING (has_tenant_access(tenant_id));

-- ========================================
-- POLICY: roles
-- ========================================
CREATE POLICY "Roles are visible to authenticated users"
ON roles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- ========================================
-- POLICY PLANNING: INSERT/UPDATE/DELETE PLACEHOLDERS
-- ========================================
-- Note: These policies will be implemented in future tasks
-- as we build invitation flow, admin management, and tenant management

-- TENANTS: INSERT/UPDATE/DELETE for platform admins only
-- DOMAINS: INSERT/UPDATE/DELETE for tenant admins or platform admins
-- MEMBERSHIPS: INSERT/UPDATE/DELETE for tenant admins or platform admins
-- ROLES: INSERT/UPDATE/DELETE for platform admins only
