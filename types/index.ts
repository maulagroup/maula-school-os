export type User = {
  id: string
  email: string
  created_at: string
}

export type School = {
  id: string
  name: string
  slug: string
  logo_url?: string
  created_at: string
}

export type SchoolBranding = {
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  font_family?: string
}

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent'
