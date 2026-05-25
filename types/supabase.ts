export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          slug: string
          npsn: string | null
          address: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          domain: string | null
          school_level: Database["public"]["Enums"]["school_level"] | null
          school_type: Database["public"]["Enums"]["school_type"] | null
          primary_color: string | null
          secondary_color: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          npsn?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          domain?: string | null
          school_level?: Database["public"]["Enums"]["school_level"] | null
          school_type?: Database["public"]["Enums"]["school_type"] | null
          primary_color?: string | null
          secondary_color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          npsn?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          domain?: string | null
          school_level?: Database["public"]["Enums"]["school_level"] | null
          school_type?: Database["public"]["Enums"]["school_type"] | null
          primary_color?: string | null
          secondary_color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      school_settings: {
        Row: {
          id: string
          school_id: string
          hero_image_url: string | null
          ppdb_active: boolean
          news_active: boolean
          theme_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          hero_image_url?: string | null
          ppdb_active?: boolean
          news_active?: boolean
          theme_config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          hero_image_url?: string | null
          ppdb_active?: boolean
          news_active?: boolean
          theme_config?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          is_system_role: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_system_role?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_system_role?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      school_users: {
        Row: {
          id: string
          school_id: string
          user_id: string
          full_name: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          user_id: string
          full_name?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          user_id?: string
          full_name?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          school_id: string
          school_user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          school_user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          school_user_id?: string
          role_id?: string
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          school_id: string
          auth_user_id: string | null
          registration_number: string | null
          full_name: string
          nik: string | null
          nisn: string | null
          birth_place: string | null
          birth_date: string | null
          gender: string | null
          religion: string | null
          address: string | null
          phone: string | null
          email: string | null
          parent_name: string | null
          parent_phone: string | null
          registration_status: Database["public"]["Enums"]["registration_status"]
          registration_date: string | null
          accepted_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          auth_user_id?: string | null
          registration_number?: string | null
          full_name: string
          nik?: string | null
          nisn?: string | null
          birth_place?: string | null
          birth_date?: string | null
          gender?: string | null
          religion?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          registration_status?: Database["public"]["Enums"]["registration_status"]
          registration_date?: string | null
          accepted_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          auth_user_id?: string | null
          registration_number?: string | null
          full_name?: string
          nik?: string | null
          nisn?: string | null
          birth_place?: string | null
          birth_date?: string | null
          gender?: string | null
          religion?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          registration_status?: Database["public"]["Enums"]["registration_status"]
          registration_date?: string | null
          accepted_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_requirements: {
        Row: {
          id: string
          school_id: string
          name: string
          description: string | null
          requirement_type: Database["public"]["Enums"]["requirement_type"]
          is_required: boolean
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          description?: string | null
          requirement_type?: Database["public"]["Enums"]["requirement_type"]
          is_required?: boolean
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          description?: string | null
          requirement_type?: Database["public"]["Enums"]["requirement_type"]
          is_required?: boolean
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      requirement_options: {
        Row: {
          id: string
          school_id: string
          document_requirement_id: string
          label: string
          value: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          document_requirement_id: string
          label: string
          value: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          document_requirement_id?: string
          label?: string
          value?: string
          sort_order?: number
          created_at?: string
        }
      }
      student_documents: {
        Row: {
          id: string
          school_id: string
          student_id: string
          document_requirement_id: string
          file_url: string | null
          text_value: string | null
          status: Database["public"]["Enums"]["document_status"]
          notes: string | null
          verified_by: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          student_id: string
          document_requirement_id: string
          file_url?: string | null
          text_value?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          student_id?: string
          document_requirement_id?: string
          file_url?: string | null
          text_value?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_requirement_answers: {
        Row: {
          id: string
          school_id: string
          student_id: string
          document_requirement_id: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          student_id: string
          document_requirement_id: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          student_id?: string
          document_requirement_id?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      news_categories: {
        Row: {
          id: string
          school_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          school_id: string
          category_id: string | null
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          featured_image_url: string | null
          author_id: string | null
          is_published: boolean
          published_at: string | null
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          category_id?: string | null
          title: string
          slug: string
          content?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          author_id?: string | null
          is_published?: boolean
          published_at?: string | null
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          category_id?: string | null
          title?: string
          slug?: string
          content?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          author_id?: string | null
          is_published?: boolean
          published_at?: string | null
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          school_id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      // Add views here later
    }
    Functions: {
      // Add functions here later
    }
    Enums: {
      registration_status: "pending" | "verified" | "accepted" | "rejected"
      document_status: "pending" | "approved" | "rejected"
      requirement_type: "text" | "textarea" | "number" | "date" | "select" | "radio" | "checkbox" | "file"
      school_level: "SD" | "SMP" | "SMA" | "SMK" | "MADRASAH" | "PESANTREN"
      school_type: "NEGERI" | "SWASTA"
    }
  }
}
