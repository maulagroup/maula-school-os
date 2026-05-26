# MAULA SCHOOL OS — DATABASE SCHEMA (REVISION)

## Struktur Tabel

### 1. tenants
Tabel utama untuk menyimpan data tenant/sekolah.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| name | VARCHAR(255) | Nama tenant/sekolah |
| slug | VARCHAR(100) | Unique slug untuk tenant |
| status | tenant_status (ENUM) | Status tenant |
| created_by | UUID | FK ke auth.users (pembuat tenant) |
| metadata | JSONB | Metadata untuk white-label |
| created_at | TIMESTAMPTZ | Waktu dibuat |
| updated_at | TIMESTAMPTZ | Waktu diupdate |
| deleted_at | TIMESTAMPTZ | Soft delete |

### 2. domains
Tabel untuk mengelola domain tenant (subdomain dan custom domain).

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| tenant_id | UUID | Foreign Key ke tenants |
| domain | VARCHAR(255) | Domain/subdomain |
| type | domain_type (ENUM) | Tipe domain |
| is_primary | BOOLEAN | Apakah domain utama |
| verified_at | TIMESTAMPTZ | Waktu verifikasi domain |
| metadata | JSONB | Metadata untuk white-label |
| created_at | TIMESTAMPTZ | Waktu dibuat |
| updated_at | TIMESTAMPTZ | Waktu diupdate |
| deleted_at | TIMESTAMPTZ | Soft delete |

### 3. roles
Tabel untuk mengelola role platform dan tenant.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| role_code | VARCHAR(100) | Code role |
| role_name | VARCHAR(255) | Nama role |
| role_scope | role_scope (ENUM) | Scope role |
| description | TEXT | Deskripsi role |
| is_system | BOOLEAN | Apakah role sistem |
| parent_role_id | UUID | Parent role (untuk inheritance) |
| created_at | TIMESTAMPTZ | Waktu dibuat |
| updated_at | TIMESTAMPTZ | Waktu diupdate |

### 4. users_profile
Tabel untuk menyimpan profil user (terkait dengan auth.users Supabase).

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key (FK ke auth.users) |
| full_name | VARCHAR(255) | Nama lengkap user |
| avatar_url | TEXT | URL avatar user |
| created_at | TIMESTAMPTZ | Waktu dibuat |
| updated_at | TIMESTAMPTZ | Waktu diupdate |

### 5. memberships
Tabel untuk menghubungkan user dengan tenant dan role.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key ke users_profile |
| tenant_id | UUID | Foreign Key ke tenants |
| role_id | UUID | Foreign Key ke roles |
| status | membership_status (ENUM) | Status membership |
| invited_by | UUID | FK ke auth.users (yang mengundang) |
| invited_at | TIMESTAMPTZ | Waktu diundang |
| metadata | JSONB | Metadata untuk white-label |
| created_at | TIMESTAMPTZ | Waktu dibuat |
| updated_at | TIMESTAMPTZ | Waktu diupdate |
| deleted_at | TIMESTAMPTZ | Soft delete |

## ENUM Types

- `tenant_status`: active, inactive, suspended
- `membership_status`: active, inactive, pending, invited
- `role_scope`: platform, tenant
- `domain_type`: subdomain, custom

## Relasi Antar Tabel

```
tenants
  ├── domains (one-to-many)
  └── memberships (one-to-many)
         ├── users_profile (many-to-one)
         └── roles (many-to-one)

roles
  └── roles (self-referential for parent role)
```

## Seed Data

### Platform Roles
- `super_admin_platform`: Super Admin Platform (full access)
- `support_admin`: Support Admin
- `finance_admin`: Finance Admin

### Tenant Roles
- `school_owner`: School Owner (is_system = true)
- `school_admin`: School Admin
- `teacher`: Teacher
- `student`: Student
- `parent`: Parent

## Unique Constraints

- `idx_unique_primary_domain_per_tenant`: Hanya 1 primary domain per tenant
- `unique_role_code_per_scope`: Role code unique per scope
- `UNIQUE(user_id, tenant_id)`: Hanya 1 membership per user per tenant

## CHECK Constraints

- `check_slug_format`: Slug hanya boleh huruf kecil, angka, dan dash
- `check_domain_format`: Validasi format domain dasar

## Indexes

- `idx_tenants_slug`: Pencarian tenant by slug
- `idx_tenants_status`: Filter tenant by status
- `idx_tenants_deleted_at`: Filter deleted tenants
- `idx_tenants_created_by`: Pencarian tenant by creator
- `idx_domains_tenant_id`: Pencarian domain by tenant
- `idx_domains_domain`: Pencarian domain by domain name
- `idx_domains_is_primary`: Filter primary domain
- `idx_domains_deleted_at`: Filter deleted domains
- `idx_domains_type`: Filter domain by type
- `idx_roles_role_code`: Pencarian role by code
- `idx_roles_role_scope`: Filter role by scope
- `idx_roles_parent_role_id`: Pencarian parent role
- `idx_roles_is_system`: Filter system roles
- `idx_memberships_user_id`: Pencarian membership by user
- `idx_memberships_tenant_id`: Pencarian membership by tenant
- `idx_memberships_role_id`: Pencarian membership by role
- `idx_memberships_status`: Filter membership by status
- `idx_memberships_deleted_at`: Filter deleted memberships
- `idx_memberships_invited_by`: Pencarian by inviter

## Soft Delete Architecture

Tabel dengan soft delete support:
- tenants
- domains
- memberships

## Invitation Flow Preparation

Kolom di memberships:
- invited_by: User yang mengundang
- invited_at: Waktu undangan
- status: invited (untuk status pending undangan)

## Metadata JSONB

Untuk future white-label flexibility:
- tenants.metadata
- domains.metadata
- memberships.metadata

## RLS

RLS tidak di-enable terlebih dahulu. Akan diimplementasikan di task terpisah.
