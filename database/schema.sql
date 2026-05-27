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

-- ========================================
-- ACADEMIC ENUMS
-- ========================================
CREATE TYPE academic_year_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE school_level AS ENUM ('sd', 'smp', 'sma', 'smk', 'custom');
CREATE TYPE class_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE department_status AS ENUM ('active', 'inactive');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated', 'transferred', 'expelled');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive', 'resigned');

-- ========================================
-- TABLE: academic_years
-- ========================================
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status academic_year_status NOT NULL DEFAULT 'draft',
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_academic_year_dates CHECK (end_date > start_date)
);

-- ========================================
-- TABLE: school_levels
-- ========================================
CREATE TABLE school_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    level school_level NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, level)
);

-- ========================================
-- TABLE: departments
-- ========================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    school_level_id UUID REFERENCES school_levels(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status department_status NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, code)
);

-- ========================================
-- TABLE: classes
-- ========================================
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    school_level_id UUID REFERENCES school_levels(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    grade_level INTEGER,
    homeroom_teacher_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    capacity INTEGER,
    status class_status NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: teacher_profiles
-- ========================================
CREATE TABLE teacher_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    nip VARCHAR(50),
    employee_id VARCHAR(50),
    specialization TEXT[],
    status teacher_status NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, nip),
    UNIQUE(tenant_id, employee_id)
);

-- ========================================
-- TABLE: student_profiles
-- ========================================
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    nis VARCHAR(50),
    nisn VARCHAR(50),
    birth_place VARCHAR(255),
    birth_date DATE,
    gender VARCHAR(10),
    address TEXT,
    status student_status NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, nis),
    UNIQUE(tenant_id, nisn)
);

-- ========================================
-- TABLE: student_class_enrollments
-- ========================================
CREATE TABLE student_class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, student_profile_id, class_id, academic_year_id)
);

-- ========================================
-- INDEXES: ACADEMIC TABLES
-- ========================================
CREATE INDEX idx_academic_years_tenant_id ON academic_years(tenant_id);
CREATE INDEX idx_academic_years_status ON academic_years(status);
CREATE INDEX idx_academic_years_is_active ON academic_years(is_active);
CREATE INDEX idx_academic_years_deleted_at ON academic_years(deleted_at);
CREATE UNIQUE INDEX idx_active_academic_year_per_tenant ON academic_years(tenant_id) WHERE is_active = TRUE AND deleted_at IS NULL;

CREATE INDEX idx_school_levels_tenant_id ON school_levels(tenant_id);
CREATE INDEX idx_school_levels_level ON school_levels(level);
CREATE INDEX idx_school_levels_is_active ON school_levels(is_active);
CREATE INDEX idx_school_levels_deleted_at ON school_levels(deleted_at);

CREATE INDEX idx_departments_tenant_id ON departments(tenant_id);
CREATE INDEX idx_departments_school_level_id ON departments(school_level_id);
CREATE INDEX idx_departments_status ON departments(status);
CREATE INDEX idx_departments_deleted_at ON departments(deleted_at);

CREATE INDEX idx_classes_tenant_id ON classes(tenant_id);
CREATE INDEX idx_classes_academic_year_id ON classes(academic_year_id);
CREATE INDEX idx_classes_school_level_id ON classes(school_level_id);
CREATE INDEX idx_classes_department_id ON classes(department_id);
CREATE INDEX idx_classes_homeroom_teacher_id ON classes(homeroom_teacher_id);
CREATE INDEX idx_classes_status ON classes(status);
CREATE INDEX idx_classes_deleted_at ON classes(deleted_at);

CREATE INDEX idx_teacher_profiles_tenant_id ON teacher_profiles(tenant_id);
CREATE INDEX idx_teacher_profiles_user_id ON teacher_profiles(user_id);
CREATE INDEX idx_teacher_profiles_status ON teacher_profiles(status);
CREATE INDEX idx_teacher_profiles_deleted_at ON teacher_profiles(deleted_at);

CREATE INDEX idx_student_profiles_tenant_id ON student_profiles(tenant_id);
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_student_profiles_status ON student_profiles(status);
CREATE INDEX idx_student_profiles_deleted_at ON student_profiles(deleted_at);

CREATE INDEX idx_student_class_enrollments_tenant_id ON student_class_enrollments(tenant_id);
CREATE INDEX idx_student_class_enrollments_student_profile_id ON student_class_enrollments(student_profile_id);
CREATE INDEX idx_student_class_enrollments_class_id ON student_class_enrollments(class_id);
CREATE INDEX idx_student_class_enrollments_academic_year_id ON student_class_enrollments(academic_year_id);
CREATE INDEX idx_student_class_enrollments_deleted_at ON student_class_enrollments(deleted_at);

-- ========================================
-- TRIGGERS: ACADEMIC TABLES
-- ========================================
CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON academic_years
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_levels_updated_at BEFORE UPDATE ON school_levels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON teacher_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_class_enrollments_updated_at BEFORE UPDATE ON student_class_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- TRIGGER: ENSURE ONLY ONE ACTIVE ACADEMIC YEAR
-- ========================================
CREATE OR REPLACE FUNCTION ensure_single_active_academic_year()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_active = TRUE THEN
        UPDATE academic_years
        SET is_active = FALSE
        WHERE tenant_id = NEW.tenant_id
          AND id != NEW.id
          AND deleted_at IS NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_single_active_academic_year
BEFORE INSERT OR UPDATE OF is_active ON academic_years
FOR EACH ROW EXECUTE FUNCTION ensure_single_active_academic_year();

-- ========================================
-- PEOPLE ENUMS
-- ========================================
CREATE TYPE staff_status AS ENUM ('active', 'inactive', 'resigned', 'terminated');
CREATE TYPE staff_type AS ENUM ('teacher', 'admin', 'operator', 'finance', 'librarian', 'counselor', 'security', 'cleaning', 'other');
CREATE TYPE parent_relation AS ENUM ('father', 'mother', 'guardian', 'other');

-- ========================================
-- TABLE: staff_profiles
-- ========================================
CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    employee_id VARCHAR(50),
    staff_type staff_type NOT NULL DEFAULT 'other',
    department VARCHAR(255),
    status staff_status NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, employee_id)
);

-- ========================================
-- TABLE: parent_profiles
-- ========================================
CREATE TABLE parent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    parent_code VARCHAR(50),
    relation parent_relation NOT NULL DEFAULT 'other',
    occupation VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, parent_code)
);

-- ========================================
-- TABLE: parent_student_relations
-- ========================================
CREATE TABLE parent_student_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_profile_id UUID NOT NULL REFERENCES parent_profiles(id) ON DELETE CASCADE,
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    relation parent_relation NOT NULL DEFAULT 'other',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, parent_profile_id, student_profile_id)
);

-- ========================================
-- INDEXES: PEOPLE TABLES
-- ========================================
CREATE INDEX idx_staff_profiles_tenant_id ON staff_profiles(tenant_id);
CREATE INDEX idx_staff_profiles_user_id ON staff_profiles(user_id);
CREATE INDEX idx_staff_profiles_staff_type ON staff_profiles(staff_type);
CREATE INDEX idx_staff_profiles_status ON staff_profiles(status);
CREATE INDEX idx_staff_profiles_deleted_at ON staff_profiles(deleted_at);

CREATE INDEX idx_parent_profiles_tenant_id ON parent_profiles(tenant_id);
CREATE INDEX idx_parent_profiles_user_id ON parent_profiles(user_id);
CREATE INDEX idx_parent_profiles_relation ON parent_profiles(relation);
CREATE INDEX idx_parent_profiles_is_primary ON parent_profiles(is_primary);
CREATE INDEX idx_parent_profiles_deleted_at ON parent_profiles(deleted_at);

CREATE INDEX idx_parent_student_relations_tenant_id ON parent_student_relations(tenant_id);
CREATE INDEX idx_parent_student_relations_parent_profile_id ON parent_student_relations(parent_profile_id);
CREATE INDEX idx_parent_student_relations_student_profile_id ON parent_student_relations(student_profile_id);
CREATE INDEX idx_parent_student_relations_is_primary ON parent_student_relations(is_primary);
CREATE INDEX idx_parent_student_relations_deleted_at ON parent_student_relations(deleted_at);

-- ========================================
-- TRIGGERS: PEOPLE TABLES
-- ========================================
CREATE TRIGGER update_staff_profiles_updated_at BEFORE UPDATE ON staff_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_profiles_updated_at BEFORE UPDATE ON parent_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_student_relations_updated_at BEFORE UPDATE ON parent_student_relations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ATTENDANCE ENUMS
-- ========================================
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'sick', 'permission', 'late');
CREATE TYPE attendance_session_status AS ENUM ('draft', 'open', 'closed', 'archived');
CREATE TYPE teacher_attendance_status AS ENUM ('present', 'absent', 'sick', 'permission', 'late');

-- ========================================
-- TABLE: attendance_sessions
-- ========================================
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status attendance_session_status NOT NULL DEFAULT 'draft',
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: student_attendance
-- ========================================
CREATE TABLE student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    attendance_session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    status attendance_status NOT NULL DEFAULT 'present',
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, attendance_session_id, student_profile_id)
);

-- ========================================
-- TABLE: teacher_attendance
-- ========================================
CREATE TABLE teacher_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    teacher_profile_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status teacher_attendance_status NOT NULL DEFAULT 'present',
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, academic_year_id, teacher_profile_id, attendance_date)
);

-- ========================================
-- INDEXES: ATTENDANCE TABLES
-- ========================================
CREATE INDEX idx_attendance_sessions_tenant_id ON attendance_sessions(tenant_id);
CREATE INDEX idx_attendance_sessions_academic_year_id ON attendance_sessions(academic_year_id);
CREATE INDEX idx_attendance_sessions_class_id ON attendance_sessions(class_id);
CREATE INDEX idx_attendance_sessions_session_date ON attendance_sessions(session_date);
CREATE INDEX idx_attendance_sessions_status ON attendance_sessions(status);
CREATE INDEX idx_attendance_sessions_deleted_at ON attendance_sessions(deleted_at);

CREATE INDEX idx_student_attendance_tenant_id ON student_attendance(tenant_id);
CREATE INDEX idx_student_attendance_attendance_session_id ON student_attendance(attendance_session_id);
CREATE INDEX idx_student_attendance_student_profile_id ON student_attendance(student_profile_id);
CREATE INDEX idx_student_attendance_status ON student_attendance(status);
CREATE INDEX idx_student_attendance_deleted_at ON student_attendance(deleted_at);

CREATE INDEX idx_teacher_attendance_tenant_id ON teacher_attendance(tenant_id);
CREATE INDEX idx_teacher_attendance_academic_year_id ON teacher_attendance(academic_year_id);
CREATE INDEX idx_teacher_attendance_teacher_profile_id ON teacher_attendance(teacher_profile_id);
CREATE INDEX idx_teacher_attendance_attendance_date ON teacher_attendance(attendance_date);
CREATE INDEX idx_teacher_attendance_status ON teacher_attendance(status);
CREATE INDEX idx_teacher_attendance_deleted_at ON teacher_attendance(deleted_at);

-- ========================================
-- TRIGGERS: ATTENDANCE TABLES
-- ========================================
CREATE TRIGGER update_attendance_sessions_updated_at BEFORE UPDATE ON attendance_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_attendance_updated_at BEFORE UPDATE ON student_attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_attendance_updated_at BEFORE UPDATE ON teacher_attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SCHEDULING ENUMS
-- ========================================
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE schedule_status AS ENUM ('draft', 'active', 'inactive', 'archived');

-- ========================================
-- TABLE: time_slots
-- ========================================
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_break BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: class_schedules
-- ========================================
CREATE TABLE class_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    time_slot_id UUID REFERENCES time_slots(id) ON DELETE SET NULL,
    teacher_profile_id UUID REFERENCES teacher_profiles(id) ON DELETE SET NULL,
    subject_name VARCHAR(255),
    day_of_week day_of_week NOT NULL,
    room_name VARCHAR(255),
    status schedule_status NOT NULL DEFAULT 'active',
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: teacher_schedules
-- ========================================
CREATE TABLE teacher_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    teacher_profile_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    time_slot_id UUID REFERENCES time_slots(id) ON DELETE SET NULL,
    class_schedule_id UUID REFERENCES class_schedules(id) ON DELETE SET NULL,
    day_of_week day_of_week NOT NULL,
    status schedule_status NOT NULL DEFAULT 'active',
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- INDEXES: SCHEDULING TABLES
-- ========================================
CREATE INDEX idx_time_slots_tenant_id ON time_slots(tenant_id);
CREATE INDEX idx_time_slots_academic_year_id ON time_slots(academic_year_id);
CREATE INDEX idx_time_slots_sort_order ON time_slots(sort_order);
CREATE INDEX idx_time_slots_deleted_at ON time_slots(deleted_at);

CREATE INDEX idx_class_schedules_tenant_id ON class_schedules(tenant_id);
CREATE INDEX idx_class_schedules_academic_year_id ON class_schedules(academic_year_id);
CREATE INDEX idx_class_schedules_class_id ON class_schedules(class_id);
CREATE INDEX idx_class_schedules_time_slot_id ON class_schedules(time_slot_id);
CREATE INDEX idx_class_schedules_teacher_profile_id ON class_schedules(teacher_profile_id);
CREATE INDEX idx_class_schedules_day_of_week ON class_schedules(day_of_week);
CREATE INDEX idx_class_schedules_status ON class_schedules(status);
CREATE INDEX idx_class_schedules_deleted_at ON class_schedules(deleted_at);

CREATE INDEX idx_teacher_schedules_tenant_id ON teacher_schedules(tenant_id);
CREATE INDEX idx_teacher_schedules_academic_year_id ON teacher_schedules(academic_year_id);
CREATE INDEX idx_teacher_schedules_teacher_profile_id ON teacher_schedules(teacher_profile_id);
CREATE INDEX idx_teacher_schedules_time_slot_id ON teacher_schedules(time_slot_id);
CREATE INDEX idx_teacher_schedules_class_schedule_id ON teacher_schedules(class_schedule_id);
CREATE INDEX idx_teacher_schedules_day_of_week ON teacher_schedules(day_of_week);
CREATE INDEX idx_teacher_schedules_status ON teacher_schedules(status);
CREATE INDEX idx_teacher_schedules_deleted_at ON teacher_schedules(deleted_at);

-- ========================================
-- TRIGGERS: SCHEDULING TABLES
-- ========================================
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at BEFORE UPDATE ON class_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_schedules_updated_at BEFORE UPDATE ON teacher_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- GRADING ENUMS
-- ========================================
CREATE TYPE assessment_type AS ENUM ('assignment', 'quiz', 'exam', 'project', 'daily');
CREATE TYPE grade_status AS ENUM ('draft', 'published', 'locked');

-- ========================================
-- TABLE: assessment_categories
-- ========================================
CREATE TABLE assessment_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    weight DECIMAL(5, 2) DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: assessments
-- ========================================
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    class_schedule_id UUID REFERENCES class_schedules(id) ON DELETE SET NULL,
    teacher_profile_id UUID REFERENCES teacher_profiles(id) ON DELETE SET NULL,
    assessment_category_id UUID REFERENCES assessment_categories(id) ON DELETE SET NULL,
    type assessment_type NOT NULL DEFAULT 'assignment',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    max_score DECIMAL(10, 2) DEFAULT 100,
    pass_score DECIMAL(10, 2),
    weight DECIMAL(5, 2) DEFAULT 0,
    due_date TIMESTAMP WITH TIME ZONE,
    status grade_status NOT NULL DEFAULT 'draft',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: student_grades
-- ========================================
CREATE TABLE student_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    score DECIMAL(10, 2),
    notes TEXT,
    status grade_status NOT NULL DEFAULT 'draft',
    graded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    graded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(tenant_id, assessment_id, student_profile_id)
);

-- ========================================
-- INDEXES: GRADING TABLES
-- ========================================
CREATE INDEX idx_assessment_categories_tenant_id ON assessment_categories(tenant_id);
CREATE INDEX idx_assessment_categories_academic_year_id ON assessment_categories(academic_year_id);
CREATE INDEX idx_assessment_categories_deleted_at ON assessment_categories(deleted_at);

CREATE INDEX idx_assessments_tenant_id ON assessments(tenant_id);
CREATE INDEX idx_assessments_academic_year_id ON assessments(academic_year_id);
CREATE INDEX idx_assessments_class_id ON assessments(class_id);
CREATE INDEX idx_assessments_teacher_profile_id ON assessments(teacher_profile_id);
CREATE INDEX idx_assessments_assessment_category_id ON assessments(assessment_category_id);
CREATE INDEX idx_assessments_type ON assessments(type);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_deleted_at ON assessments(deleted_at);

CREATE INDEX idx_student_grades_tenant_id ON student_grades(tenant_id);
CREATE INDEX idx_student_grades_assessment_id ON student_grades(assessment_id);
CREATE INDEX idx_student_grades_student_profile_id ON student_grades(student_profile_id);
CREATE INDEX idx_student_grades_status ON student_grades(status);
CREATE INDEX idx_student_grades_deleted_at ON student_grades(deleted_at);

-- ========================================
-- TRIGGERS: GRADING TABLES
-- ========================================
CREATE TRIGGER update_assessment_categories_updated_at BEFORE UPDATE ON assessment_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_grades_updated_at BEFORE UPDATE ON student_grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- LMS ENUMS
-- ========================================
CREATE TYPE material_type AS ENUM ('document', 'link', 'video', 'attachment', 'rich_text');
CREATE TYPE classroom_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE assignment_status AS ENUM ('draft', 'published', 'closed');
CREATE TYPE stream_type AS ENUM ('announcement', 'material', 'assignment', 'update');

-- ========================================
-- TABLE: classrooms
-- ========================================
CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    teacher_profile_id UUID REFERENCES teacher_profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject_name VARCHAR(255),
    status classroom_status NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: classroom_members
-- ========================================
CREATE TABLE classroom_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_profile_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    teacher_profile_id UUID REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    CHECK ((student_profile_id IS NOT NULL) OR (teacher_profile_id IS NOT NULL)),
    UNIQUE(tenant_id, classroom_id, student_profile_id),
    UNIQUE(tenant_id, classroom_id, teacher_profile_id)
);

-- ========================================
-- TABLE: learning_materials
-- ========================================
CREATE TABLE learning_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type material_type NOT NULL DEFAULT 'document',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    file_url TEXT,
    link_url TEXT,
    order_index INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: classroom_assignments
-- ========================================
CREATE TABLE classroom_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    max_score DECIMAL(10, 2) DEFAULT 100,
    status assignment_status NOT NULL DEFAULT 'draft',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: classroom_stream
-- ========================================
CREATE TABLE classroom_stream (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type stream_type NOT NULL DEFAULT 'announcement',
    title VARCHAR(255),
    content TEXT,
    learning_material_id UUID REFERENCES learning_materials(id) ON DELETE SET NULL,
    classroom_assignment_id UUID REFERENCES classroom_assignments(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- INDEXES: LMS TABLES
-- ========================================
CREATE INDEX idx_classrooms_tenant_id ON classrooms(tenant_id);
CREATE INDEX idx_classrooms_academic_year_id ON classrooms(academic_year_id);
CREATE INDEX idx_classrooms_class_id ON classrooms(class_id);
CREATE INDEX idx_classrooms_teacher_profile_id ON classrooms(teacher_profile_id);
CREATE INDEX idx_classrooms_status ON classrooms(status);
CREATE INDEX idx_classrooms_deleted_at ON classrooms(deleted_at);

CREATE INDEX idx_classroom_members_tenant_id ON classroom_members(tenant_id);
CREATE INDEX idx_classroom_members_classroom_id ON classroom_members(classroom_id);
CREATE INDEX idx_classroom_members_student_profile_id ON classroom_members(student_profile_id);
CREATE INDEX idx_classroom_members_teacher_profile_id ON classroom_members(teacher_profile_id);
CREATE INDEX idx_classroom_members_deleted_at ON classroom_members(deleted_at);

CREATE INDEX idx_learning_materials_tenant_id ON learning_materials(tenant_id);
CREATE INDEX idx_learning_materials_classroom_id ON learning_materials(classroom_id);
CREATE INDEX idx_learning_materials_type ON learning_materials(type);
CREATE INDEX idx_learning_materials_order_index ON learning_materials(order_index);
CREATE INDEX idx_learning_materials_deleted_at ON learning_materials(deleted_at);

CREATE INDEX idx_classroom_assignments_tenant_id ON classroom_assignments(tenant_id);
CREATE INDEX idx_classroom_assignments_classroom_id ON classroom_assignments(classroom_id);
CREATE INDEX idx_classroom_assignments_assessment_id ON classroom_assignments(assessment_id);
CREATE INDEX idx_classroom_assignments_status ON classroom_assignments(status);
CREATE INDEX idx_classroom_assignments_deleted_at ON classroom_assignments(deleted_at);

CREATE INDEX idx_classroom_stream_tenant_id ON classroom_stream(tenant_id);
CREATE INDEX idx_classroom_stream_classroom_id ON classroom_stream(classroom_id);
CREATE INDEX idx_classroom_stream_type ON classroom_stream(type);
CREATE INDEX idx_classroom_stream_created_at ON classroom_stream(created_at);
CREATE INDEX idx_classroom_stream_deleted_at ON classroom_stream(deleted_at);

-- ========================================
-- TRIGGERS: LMS TABLES
-- ========================================
CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON classrooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classroom_members_updated_at BEFORE UPDATE ON classroom_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_materials_updated_at BEFORE UPDATE ON learning_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classroom_assignments_updated_at BEFORE UPDATE ON classroom_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classroom_stream_updated_at BEFORE UPDATE ON classroom_stream
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ENUMS: COMMUNICATION & NOTIFICATIONS
-- ========================================
CREATE TYPE notification_type AS ENUM (
    'attendance',
    'lms',
    'grading',
    'onboarding',
    'system',
    'announcement'
);

CREATE TYPE notification_status AS ENUM (
    'unread',
    'read',
    'dismissed'
);

CREATE TYPE announcement_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);

CREATE TYPE notification_channel AS ENUM (
    'in_app',
    'email',
    'whatsapp',
    'push'
);

-- ========================================
-- TABLE: notifications
-- ========================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    type notification_type NOT NULL DEFAULT 'system',
    title VARCHAR(255) NOT NULL,
    content TEXT,
    url TEXT,
    status notification_status NOT NULL DEFAULT 'unread',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: announcements
-- ========================================
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    priority announcement_priority NOT NULL DEFAULT 'normal',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    target_roles JSONB DEFAULT '[]'::jsonb,
    target_classes JSONB DEFAULT '[]'::jsonb,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: notification_preferences
-- ========================================
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tenant_id, type, channel)
);

-- ========================================
-- INDEXES: COMMUNICATION & NOTIFICATIONS
-- ========================================
CREATE INDEX idx_notifications_tenant_id ON notifications(tenant_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_deleted_at ON notifications(deleted_at);

CREATE INDEX idx_announcements_tenant_id ON announcements(tenant_id);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_is_pinned ON announcements(is_pinned);
CREATE INDEX idx_announcements_published_at ON announcements(published_at DESC);
CREATE INDEX idx_announcements_deleted_at ON announcements(deleted_at);

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX idx_notification_preferences_tenant_id ON notification_preferences(tenant_id);

-- ========================================
-- TRIGGERS: COMMUNICATION & NOTIFICATIONS
-- ========================================
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ENUMS: PPDB
-- ========================================
CREATE TYPE ppdb_status AS ENUM (
    'draft',
    'submitted',
    'verified',
    'accepted',
    'rejected',
    'cancelled'
);

CREATE TYPE ppdb_school_level AS ENUM (
    'sd',
    'smp',
    'sma',
    'smk'
);

CREATE TYPE ppdb_gender AS ENUM (
    'male',
    'female'
);

-- ========================================
-- TABLE: ppdb_registrations
-- ========================================
CREATE TABLE ppdb_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    registration_number VARCHAR(50),
    status ppdb_status NOT NULL DEFAULT 'draft',
    school_level ppdb_school_level NOT NULL,
    grade INT,
    
    -- Student identity
    full_name VARCHAR(255) NOT NULL,
    nick_name VARCHAR(255),
    gender ppdb_gender NOT NULL,
    birth_place VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    nisn VARCHAR(20),
    previous_school VARCHAR(255),
    
    -- Parent identity
    father_name VARCHAR(255),
    father_phone VARCHAR(20),
    father_occupation VARCHAR(255),
    mother_name VARCHAR(255),
    mother_phone VARCHAR(20),
    mother_occupation VARCHAR(255),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    
    -- Other
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: ppdb_periods
-- ========================================
CREATE TABLE ppdb_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    school_level ppdb_school_level NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    quota INT,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- INDEXES: PPDB
-- ========================================
CREATE UNIQUE INDEX idx_ppdb_registrations_registration_number ON ppdb_registrations(registration_number);
CREATE INDEX idx_ppdb_registrations_tenant_id ON ppdb_registrations(tenant_id);
CREATE INDEX idx_ppdb_registrations_status ON ppdb_registrations(status);
CREATE INDEX idx_ppdb_registrations_school_level ON ppdb_registrations(school_level);
CREATE INDEX idx_ppdb_registrations_created_at ON ppdb_registrations(created_at DESC);
CREATE INDEX idx_ppdb_registrations_deleted_at ON ppdb_registrations(deleted_at);

CREATE INDEX idx_ppdb_periods_tenant_id ON ppdb_periods(tenant_id);
CREATE INDEX idx_ppdb_periods_is_active ON ppdb_periods(is_active);
CREATE INDEX idx_ppdb_periods_school_level ON ppdb_periods(school_level);
CREATE INDEX idx_ppdb_periods_deleted_at ON ppdb_periods(deleted_at);

-- ========================================
-- TRIGGERS: PPDB
-- ========================================
CREATE TRIGGER update_ppdb_registrations_updated_at BEFORE UPDATE ON ppdb_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ppdb_periods_updated_at BEFORE UPDATE ON ppdb_periods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ENUMS: FINANCE & BILLING
-- ========================================
CREATE TYPE billing_type AS ENUM (
    'spp',
    'registration',
    'building',
    'exam',
    'activity',
    'custom'
);

CREATE TYPE billing_frequency AS ENUM (
    'one_time',
    'monthly',
    'quarterly',
    'semesterly',
    'yearly'
);

CREATE TYPE payment_status AS ENUM (
    'unpaid',
    'partial',
    'paid',
    'overdue'
);

CREATE TYPE payment_method AS ENUM (
    'cash',
    'bank_transfer',
    'va',
    'qris',
    'credit_card',
    'other'
);

-- ========================================
-- TABLE: billing_categories
-- ========================================
CREATE TABLE billing_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    type billing_type NOT NULL DEFAULT 'custom',
    frequency billing_frequency NOT NULL DEFAULT 'one_time',
    default_amount DECIMAL(15, 2),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: student_bills
-- ========================================
CREATE TABLE student_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    billing_category_id UUID REFERENCES billing_categories(id) ON DELETE SET NULL,
    bill_number VARCHAR(50),
    type billing_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    status payment_status NOT NULL DEFAULT 'unpaid',
    due_date DATE,
    period_month INT,
    period_year INT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- TABLE: payments
-- ========================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_bill_id UUID NOT NULL REFERENCES student_bills(id) ON DELETE CASCADE,
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    payment_number VARCHAR(50),
    amount DECIMAL(15, 2) NOT NULL,
    method payment_method NOT NULL DEFAULT 'other',
    payment_date DATE NOT NULL,
    reference_number VARCHAR(255),
    notes TEXT,
    received_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- INDEXES: FINANCE & BILLING
-- ========================================
CREATE UNIQUE INDEX idx_billing_categories_code ON billing_categories(code) WHERE code IS NOT NULL;
CREATE INDEX idx_billing_categories_tenant_id ON billing_categories(tenant_id);
CREATE INDEX idx_billing_categories_type ON billing_categories(type);
CREATE INDEX idx_billing_categories_is_active ON billing_categories(is_active);
CREATE INDEX idx_billing_categories_deleted_at ON billing_categories(deleted_at);

CREATE UNIQUE INDEX idx_student_bills_bill_number ON student_bills(bill_number) WHERE bill_number IS NOT NULL;
CREATE INDEX idx_student_bills_tenant_id ON student_bills(tenant_id);
CREATE INDEX idx_student_bills_student_profile_id ON student_bills(student_profile_id);
CREATE INDEX idx_student_bills_academic_year_id ON student_bills(academic_year_id);
CREATE INDEX idx_student_bills_status ON student_bills(status);
CREATE INDEX idx_student_bills_due_date ON student_bills(due_date);
CREATE INDEX idx_student_bills_deleted_at ON student_bills(deleted_at);

CREATE UNIQUE INDEX idx_payments_payment_number ON payments(payment_number) WHERE payment_number IS NOT NULL;
CREATE INDEX idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX idx_payments_student_bill_id ON payments(student_bill_id);
CREATE INDEX idx_payments_student_profile_id ON payments(student_profile_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date DESC);
CREATE INDEX idx_payments_method ON payments(method);
CREATE INDEX idx_payments_deleted_at ON payments(deleted_at);

-- ========================================
-- TRIGGERS: FINANCE & BILLING
-- ========================================
CREATE TRIGGER update_billing_categories_updated_at BEFORE UPDATE ON billing_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_bills_updated_at BEFORE UPDATE ON student_bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
