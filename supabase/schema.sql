-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================
CREATE TYPE registration_status AS ENUM ('pending', 'verified', 'accepted', 'rejected');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE requirement_type AS ENUM ('text', 'textarea', 'number', 'date', 'select', 'radio', 'checkbox', 'file');
CREATE TYPE school_level AS ENUM ('SD', 'SMP', 'SMA', 'SMK', 'MADRASAH', 'PESANTREN');
CREATE TYPE school_type AS ENUM ('NEGERI', 'SWASTA');

-- =============================================
-- TABLE: schools
-- =============================================
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  npsn VARCHAR(50),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  logo_url TEXT,
  domain VARCHAR(255) UNIQUE,
  school_level school_level,
  school_type school_type,
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: school_settings
-- =============================================
CREATE TABLE school_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL UNIQUE,
  hero_image_url TEXT,
  ppdb_active BOOLEAN DEFAULT true,
  news_active BOOLEAN DEFAULT true,
  theme_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: roles
-- =============================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system_role BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: school_users
-- =============================================
CREATE TABLE school_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(school_id, user_id)
);

-- =============================================
-- TABLE: user_roles
-- =============================================
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  school_user_id UUID REFERENCES school_users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(school_user_id, role_id)
);

-- =============================================
-- TABLE: students
-- =============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id),
  registration_number VARCHAR(100),
  full_name VARCHAR(255) NOT NULL,
  nik VARCHAR(20),
  nisn VARCHAR(20),
  birth_place VARCHAR(100),
  birth_date DATE,
  gender VARCHAR(20),
  religion VARCHAR(50),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  registration_status registration_status DEFAULT 'pending',
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  accepted_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(school_id, registration_number)
);

-- =============================================
-- TABLE: document_requirements
-- =============================================
CREATE TABLE document_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  requirement_type requirement_type DEFAULT 'file',
  is_required BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: requirement_options
-- =============================================
CREATE TABLE requirement_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  document_requirement_id UUID REFERENCES document_requirements(id) ON DELETE CASCADE NOT NULL,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: student_documents
-- =============================================
CREATE TABLE student_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  document_requirement_id UUID REFERENCES document_requirements(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT,
  text_value TEXT,
  status document_status DEFAULT 'pending',
  notes TEXT,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: student_requirement_answers
-- =============================================
CREATE TABLE student_requirement_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  document_requirement_id UUID REFERENCES document_requirements(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: news_categories
-- =============================================
CREATE TABLE news_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(school_id, name)
);

-- =============================================
-- TABLE: news
-- =============================================
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES news_categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES school_users(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(school_id, slug)
);

-- =============================================
-- TABLE: activity_logs
-- =============================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_domain ON schools(domain);
CREATE INDEX idx_schools_is_active ON schools(is_active);
CREATE INDEX idx_school_settings_school_id ON school_settings(school_id);
CREATE INDEX idx_school_users_school_id ON school_users(school_id);
CREATE INDEX idx_school_users_user_id ON school_users(user_id);
CREATE INDEX idx_user_roles_school_id ON user_roles(school_id);
CREATE INDEX idx_user_roles_school_user_id ON user_roles(school_user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_auth_user_id ON students(auth_user_id);
CREATE INDEX idx_students_registration_status ON students(registration_status);
CREATE INDEX idx_document_requirements_school_id ON document_requirements(school_id);
CREATE INDEX idx_document_requirements_is_active ON document_requirements(is_active);
CREATE INDEX idx_requirement_options_school_id ON requirement_options(school_id);
CREATE INDEX idx_requirement_options_requirement_id ON requirement_options(document_requirement_id);
CREATE INDEX idx_student_documents_school_id ON student_documents(school_id);
CREATE INDEX idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX idx_student_requirement_answers_school_id ON student_requirement_answers(school_id);
CREATE INDEX idx_student_requirement_answers_student_id ON student_requirement_answers(student_id);
CREATE INDEX idx_news_categories_school_id ON news_categories(school_id);
CREATE INDEX idx_news_school_id ON news(school_id);
CREATE INDEX idx_news_published ON news(is_published, published_at);
CREATE INDEX idx_activity_logs_school_id ON activity_logs(school_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_school_settings_updated_at BEFORE UPDATE ON school_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_school_users_updated_at BEFORE UPDATE ON school_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_requirements_updated_at BEFORE UPDATE ON document_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_categories_updated_at BEFORE UPDATE ON news_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_documents_updated_at BEFORE UPDATE ON student_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_requirement_answers_updated_at BEFORE UPDATE ON student_requirement_answers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT DEFAULT SYSTEM ROLES
-- =============================================
INSERT INTO roles (id, name, description, is_system_role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'OWNER_SUPERADMIN', 'Owner Super Administrator with full access', true),
  ('00000000-0000-0000-0000-000000000002', 'OWNER_ADMIN', 'Owner Administrator', true),
  ('00000000-0000-0000-0000-000000000003', 'SCHOOL_SUPERADMIN', 'School Super Administrator', true),
  ('00000000-0000-0000-0000-000000000004', 'SCHOOL_ADMIN', 'School Administrator', true),
  ('00000000-0000-0000-0000-000000000005', 'TEACHER', 'Teacher', true),
  ('00000000-0000-0000-0000-000000000006', 'STUDENT', 'Student', true),
  ('00000000-0000-0000-0000-000000000007', 'PARENT', 'Student Parent', true)
ON CONFLICT DO NOTHING;
