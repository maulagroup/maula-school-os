-- =============================================
-- ROW LEVEL SECURITY POLICIES - FINAL PRODUCTION READY
-- Multi-tenant SaaS School Platform - SECURED
-- =============================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirement_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_requirement_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS - HARDENED
-- =============================================

-- Check if current user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.school_users su
    JOIN public.user_roles ur ON su.id = ur.school_user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE su.user_id = auth.uid()
    AND r.name = role_name
  );
END;
$$;

-- Get current user's roles
CREATE OR REPLACE FUNCTION public.get_current_user_roles()
RETURNS TABLE (role_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT r.name
  FROM public.school_users su
  JOIN public.user_roles ur ON su.id = ur.school_user_id
  JOIN public.roles r ON ur.role_id = r.id
  WHERE su.user_id = auth.uid();
END;
$$;

-- Check if current user is owner super admin
CREATE OR REPLACE FUNCTION public.is_owner_superadmin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.has_role('OWNER_SUPERADMIN');
END;
$$;

-- Check if current user is owner admin
CREATE OR REPLACE FUNCTION public.is_owner_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.has_role('OWNER_SUPERADMIN') OR public.has_role('OWNER_ADMIN');
END;
$$;

-- Get current user's school_id
CREATE OR REPLACE FUNCTION public.get_current_school_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id UUID;
BEGIN
  SELECT su.school_id INTO v_school_id
  FROM public.school_users su
  WHERE su.user_id = auth.uid()
  LIMIT 1;
  
  RETURN v_school_id;
END;
$$;

-- Check if current user has access to a specific school
CREATE OR REPLACE FUNCTION public.has_school_access(p_school_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_owner_superadmin() OR public.is_owner_admin() THEN
    RETURN true;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.school_users su
    WHERE su.user_id = auth.uid()
    AND su.school_id = p_school_id
  );
END;
$$;

-- Check if current user has school super admin access
CREATE OR REPLACE FUNCTION public.is_school_superadmin(p_school_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_owner_superadmin() THEN
    RETURN true;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.school_users su
    JOIN public.user_roles ur ON su.id = ur.school_user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE su.user_id = auth.uid()
    AND su.school_id = p_school_id
    AND r.name = 'SCHOOL_SUPERADMIN'
  );
END;
$$;

-- Check if current user has any school admin access
CREATE OR REPLACE FUNCTION public.is_any_school_admin(p_school_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_owner_superadmin() THEN
    RETURN true;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.school_users su
    JOIN public.user_roles ur ON su.id = ur.school_user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE su.user_id = auth.uid()
    AND su.school_id = p_school_id
    AND r.name IN ('SCHOOL_SUPERADMIN', 'SCHOOL_ADMIN')
  );
END;
$$;

-- Check if current user has school admin access (for news only)
CREATE OR REPLACE FUNCTION public.is_school_admin(p_school_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_owner_superadmin() OR public.is_owner_admin() THEN
    RETURN true;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.school_users su
    JOIN public.user_roles ur ON su.id = ur.school_user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE su.user_id = auth.uid()
    AND su.school_id = p_school_id
    AND r.name IN ('SCHOOL_SUPERADMIN', 'SCHOOL_ADMIN')
  );
END;
$$;

-- =============================================
-- TABLE: schools
-- =============================================
DROP POLICY IF EXISTS "schools_select" ON schools;
DROP POLICY IF EXISTS "schools_insert" ON schools;
DROP POLICY IF EXISTS "schools_update" ON schools;
DROP POLICY IF EXISTS "schools_delete" ON schools;

CREATE POLICY "schools_select" ON schools
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.has_school_access(id)
  )
);

CREATE POLICY "schools_insert" ON schools
FOR INSERT
WITH CHECK (public.is_owner_superadmin());

CREATE POLICY "schools_update" ON schools
FOR UPDATE
USING (public.is_owner_superadmin())
WITH CHECK (public.is_owner_superadmin());

CREATE POLICY "schools_delete" ON schools
FOR DELETE
USING (public.is_owner_superadmin());

-- =============================================
-- TABLE: school_settings
-- =============================================
DROP POLICY IF EXISTS "school_settings_select" ON school_settings;
DROP POLICY IF EXISTS "school_settings_insert" ON school_settings;
DROP POLICY IF EXISTS "school_settings_update" ON school_settings;
DROP POLICY IF EXISTS "school_settings_delete" ON school_settings;

CREATE POLICY "school_settings_select" ON school_settings
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.has_school_access(school_id)
  )
);

CREATE POLICY "school_settings_insert" ON school_settings
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "school_settings_update" ON school_settings
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "school_settings_delete" ON school_settings
FOR DELETE
USING (public.is_owner_superadmin());

-- =============================================
-- TABLE: roles
-- =============================================
DROP POLICY IF EXISTS "roles_select" ON roles;
DROP POLICY IF EXISTS "roles_insert" ON roles;
DROP POLICY IF EXISTS "roles_update" ON roles;
DROP POLICY IF EXISTS "roles_delete" ON roles;

CREATE POLICY "roles_select" ON roles
FOR SELECT
USING (
  public.is_owner_superadmin() OR 
  public.is_owner_admin() OR 
  auth.uid() IS NOT NULL
);

CREATE POLICY "roles_insert" ON roles
FOR INSERT
WITH CHECK (public.is_owner_superadmin());

CREATE POLICY "roles_update" ON roles
FOR UPDATE
USING (public.is_owner_superadmin())
WITH CHECK (public.is_owner_superadmin());

CREATE POLICY "roles_delete" ON roles
FOR DELETE
USING (public.is_owner_superadmin());

-- =============================================
-- TABLE: school_users
-- =============================================
DROP POLICY IF EXISTS "school_users_select" ON school_users;
DROP POLICY IF EXISTS "school_users_insert" ON school_users;
DROP POLICY IF EXISTS "school_users_update" ON school_users;
DROP POLICY IF EXISTS "school_users_delete" ON school_users;

CREATE POLICY "school_users_select" ON school_users
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "school_users_insert" ON school_users
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "school_users_update" ON school_users
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id) OR
    (user_id = auth.uid())
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id) OR
    (user_id = auth.uid())
  )
);

CREATE POLICY "school_users_delete" ON school_users
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

-- =============================================
-- TABLE: user_roles
-- =============================================
DROP POLICY IF EXISTS "user_roles_select" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert" ON user_roles;
DROP POLICY IF EXISTS "user_roles_update" ON user_roles;
DROP POLICY IF EXISTS "user_roles_delete" ON user_roles;

CREATE POLICY "user_roles_select" ON user_roles
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "user_roles_insert" ON user_roles
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "user_roles_update" ON user_roles
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "user_roles_delete" ON user_roles
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

-- =============================================
-- TABLE: students
-- =============================================
DROP POLICY IF EXISTS "students_select" ON students;
DROP POLICY IF EXISTS "students_insert" ON students;
DROP POLICY IF EXISTS "students_update" ON students;
DROP POLICY IF EXISTS "students_delete" ON students;

CREATE POLICY "students_select" ON students
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "students_insert" ON students
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "students_update" ON students
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "students_delete" ON students
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

-- =============================================
-- TABLE: document_requirements
-- =============================================
DROP POLICY IF EXISTS "document_requirements_select" ON document_requirements;
DROP POLICY IF EXISTS "document_requirements_insert" ON document_requirements;
DROP POLICY IF EXISTS "document_requirements_update" ON document_requirements;
DROP POLICY IF EXISTS "document_requirements_delete" ON document_requirements;

CREATE POLICY "document_requirements_select" ON document_requirements
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "document_requirements_insert" ON document_requirements
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "document_requirements_update" ON document_requirements
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "document_requirements_delete" ON document_requirements
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

-- =============================================
-- TABLE: requirement_options
-- =============================================
DROP POLICY IF EXISTS "requirement_options_select" ON requirement_options;
DROP POLICY IF EXISTS "requirement_options_insert" ON requirement_options;
DROP POLICY IF EXISTS "requirement_options_update" ON requirement_options;
DROP POLICY IF EXISTS "requirement_options_delete" ON requirement_options;

CREATE POLICY "requirement_options_select" ON requirement_options
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "requirement_options_insert" ON requirement_options
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "requirement_options_update" ON requirement_options
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "requirement_options_delete" ON requirement_options
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

-- =============================================
-- TABLE: student_documents
-- =============================================
DROP POLICY IF EXISTS "student_documents_select" ON student_documents;
DROP POLICY IF EXISTS "student_documents_insert" ON student_documents;
DROP POLICY IF EXISTS "student_documents_update" ON student_documents;
DROP POLICY IF EXISTS "student_documents_delete" ON student_documents;

CREATE POLICY "student_documents_select" ON student_documents
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "student_documents_insert" ON student_documents
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "student_documents_update" ON student_documents
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "student_documents_delete" ON student_documents
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

-- =============================================
-- TABLE: student_requirement_answers
-- =============================================
DROP POLICY IF EXISTS "student_requirement_answers_select" ON student_requirement_answers;
DROP POLICY IF EXISTS "student_requirement_answers_insert" ON student_requirement_answers;
DROP POLICY IF EXISTS "student_requirement_answers_update" ON student_requirement_answers;
DROP POLICY IF EXISTS "student_requirement_answers_delete" ON student_requirement_answers;

CREATE POLICY "student_requirement_answers_select" ON student_requirement_answers
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "student_requirement_answers_insert" ON student_requirement_answers
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "student_requirement_answers_update" ON student_requirement_answers
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "student_requirement_answers_delete" ON student_requirement_answers
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_superadmin(school_id)
  )
);

-- =============================================
-- TABLE: news_categories
-- =============================================
DROP POLICY IF EXISTS "news_categories_select" ON news_categories;
DROP POLICY IF EXISTS "news_categories_insert" ON news_categories;
DROP POLICY IF EXISTS "news_categories_update" ON news_categories;
DROP POLICY IF EXISTS "news_categories_delete" ON news_categories;

CREATE POLICY "news_categories_select" ON news_categories
FOR SELECT
USING (
  public.is_owner_superadmin() OR 
  public.is_owner_admin() OR 
  public.is_school_admin(school_id)
);

CREATE POLICY "news_categories_insert" ON news_categories
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_admin(school_id)
  )
);

CREATE POLICY "news_categories_update" ON news_categories
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_admin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_admin(school_id)
  )
);

CREATE POLICY "news_categories_delete" ON news_categories
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_admin(school_id)
  )
);

-- =============================================
-- TABLE: news
-- =============================================
DROP POLICY IF EXISTS "news_select" ON news;
DROP POLICY IF EXISTS "news_select_public" ON news;
DROP POLICY IF EXISTS "news_insert" ON news;
DROP POLICY IF EXISTS "news_update" ON news;
DROP POLICY IF EXISTS "news_delete" ON news;

CREATE POLICY "news_select" ON news
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_admin(school_id)
  )
);

CREATE POLICY "news_select_public" ON news
FOR SELECT
USING (
  is_published = true AND published_at <= NOW()
);

CREATE POLICY "news_insert" ON news
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_admin(school_id)
  )
);

CREATE POLICY "news_update" ON news
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_admin(school_id)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_admin(school_id)
  )
);

CREATE POLICY "news_delete" ON news
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_school_admin(school_id)
  )
);

-- =============================================
-- TABLE: activity_logs
-- =============================================
DROP POLICY IF EXISTS "activity_logs_select" ON activity_logs;
DROP POLICY IF EXISTS "activity_logs_insert" ON activity_logs;
DROP POLICY IF EXISTS "activity_logs_update" ON activity_logs;
DROP POLICY IF EXISTS "activity_logs_delete" ON activity_logs;

CREATE POLICY "activity_logs_select" ON activity_logs
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.is_school_superadmin(school_id)
  )
);

CREATE POLICY "activity_logs_insert" ON activity_logs
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    public.is_owner_superadmin() OR 
    public.is_owner_admin() OR 
    public.has_school_access(school_id)
  )
);

-- Activity logs should not be updated or deleted
