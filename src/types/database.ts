export type TenantStatus = "active" | "inactive" | "suspended";
export type MembershipStatus = "active" | "inactive" | "pending" | "invited";
export type RoleScope = "platform" | "tenant";
export type DomainType = "subdomain" | "custom";

export type AcademicYearStatus = "draft" | "active" | "completed" | "archived";
export type SchoolLevelCode = "sd" | "smp" | "sma" | "smk" | "custom";
export type ClassStatus = "active" | "inactive" | "archived";
export type DepartmentStatus = "active" | "inactive";
export type StudentStatus = "active" | "inactive" | "graduated" | "transferred" | "expelled";
export type TeacherStatus = "active" | "inactive" | "resigned";
export type StaffStatus = "active" | "inactive" | "resigned" | "terminated";
export type StaffType = "teacher" | "admin" | "operator" | "finance" | "librarian" | "counselor" | "security" | "cleaning" | "other";
export type ParentRelation = "father" | "mother" | "guardian" | "other";
export type AttendanceStatus = "present" | "absent" | "sick" | "permission" | "late";
export type AttendanceSessionStatus = "draft" | "open" | "closed" | "archived";
export type TeacherAttendanceStatus = "present" | "absent" | "sick" | "permission" | "late";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ScheduleStatus = "draft" | "active" | "inactive" | "archived";
export type AssessmentType = "assignment" | "quiz" | "exam" | "project" | "daily";
export type GradeStatus = "draft" | "published" | "locked";
export type MaterialType = "document" | "link" | "video" | "attachment" | "rich_text";
export type ClassroomStatus = "draft" | "active" | "archived";
export type AssignmentStatus = "draft" | "published" | "closed";
export type StreamType = "announcement" | "material" | "assignment" | "update";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  createdBy?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Domain {
  id: string;
  tenantId: string;
  domain: string;
  type: DomainType;
  isPrimary: boolean;
  verifiedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Role {
  id: string;
  roleCode: string;
  roleName: string;
  roleScope: RoleScope;
  description?: string;
  isSystem: boolean;
  parentRoleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  tenantId: string;
  roleId: string;
  status: MembershipStatus;
  invitedBy?: string;
  invitedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AcademicYear {
  id: string;
  tenantId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: AcademicYearStatus;
  isActive: boolean;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface SchoolLevel {
  id: string;
  tenantId: string;
  level: SchoolLevelCode;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Department {
  id: string;
  tenantId: string;
  schoolLevelId?: string;
  code: string;
  name: string;
  description?: string;
  status: DepartmentStatus;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Class {
  id: string;
  tenantId: string;
  academicYearId: string;
  schoolLevelId?: string;
  departmentId?: string;
  name: string;
  gradeLevel?: number;
  homeroomTeacherId?: string;
  capacity?: number;
  status: ClassStatus;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface TeacherProfile {
  id: string;
  tenantId: string;
  userId?: string;
  nip?: string;
  employeeId?: string;
  specialization?: string[];
  status: TeacherStatus;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface StudentProfile {
  id: string;
  tenantId: string;
  userId?: string;
  nis?: string;
  nisn?: string;
  birthPlace?: string;
  birthDate?: Date;
  gender?: string;
  address?: string;
  status: StudentStatus;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface StudentClassEnrollment {
  id: string;
  tenantId: string;
  studentProfileId: string;
  classId: string;
  academicYearId: string;
  enrollmentDate: Date;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface StaffProfile {
  id: string;
  tenantId: string;
  userId?: string;
  employeeId?: string;
  staffType: StaffType;
  department?: string;
  status: StaffStatus;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ParentProfile {
  id: string;
  tenantId: string;
  userId?: string;
  parentCode?: string;
  relation: ParentRelation;
  occupation?: string;
  phone?: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ParentStudentRelation {
  id: string;
  tenantId: string;
  parentProfileId: string;
  studentProfileId: string;
  relation: ParentRelation;
  isPrimary: boolean;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AttendanceSession {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId?: string;
  name: string;
  sessionDate: Date;
  startTime?: string;
  endTime?: string;
  status: AttendanceSessionStatus;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface StudentAttendance {
  id: string;
  tenantId: string;
  attendanceSessionId: string;
  studentProfileId: string;
  status: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface TeacherAttendance {
  id: string;
  tenantId: string;
  academicYearId: string;
  teacherProfileId: string;
  attendanceDate: Date;
  status: TeacherAttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AssessmentCategory {
  id: string;
  tenantId: string;
  academicYearId: string;
  name: string;
  description?: string;
  weight: number;
  sortOrder: number;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Assessment {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId?: string;
  classScheduleId?: string;
  teacherProfileId?: string;
  assessmentCategoryId?: string;
  type: AssessmentType;
  title: string;
  description?: string;
  maxScore: number;
  passScore?: number;
  weight: number;
  dueDate?: Date;
  status: GradeStatus;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface StudentGrade {
  id: string;
  tenantId: string;
  assessmentId: string;
  studentProfileId: string;
  score?: number;
  notes?: string;
  status: GradeStatus;
  gradedBy?: string;
  gradedAt?: Date;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface TimeSlot {
  id: string;
  tenantId: string;
  academicYearId: string;
  name: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
  isBreak: boolean;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ClassSchedule {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId?: string;
  timeSlotId?: string;
  teacherProfileId?: string;
  subjectName?: string;
  dayOfWeek: DayOfWeek;
  roomName?: string;
  status: ScheduleStatus;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface TeacherSchedule {
  id: string;
  tenantId: string;
  academicYearId: string;
  teacherProfileId: string;
  timeSlotId?: string;
  classScheduleId?: string;
  dayOfWeek: DayOfWeek;
  status: ScheduleStatus;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Classroom {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId?: string;
  teacherProfileId?: string;
  name: string;
  description?: string;
  subjectName?: string;
  status: ClassroomStatus;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ClassroomMember {
  id: string;
  tenantId: string;
  classroomId: string;
  studentProfileId?: string;
  teacherProfileId?: string;
  role: string;
  joinedAt: Date;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface LearningMaterial {
  id: string;
  tenantId: string;
  classroomId: string;
  createdBy?: string;
  type: MaterialType;
  title: string;
  description?: string;
  content?: string;
  fileUrl?: string;
  linkUrl?: string;
  orderIndex: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ClassroomAssignment {
  id: string;
  tenantId: string;
  classroomId: string;
  assessmentId?: string;
  createdBy?: string;
  title: string;
  description?: string;
  dueDate?: Date;
  maxScore: number;
  status: AssignmentStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ClassroomStream {
  id: string;
  tenantId: string;
  classroomId: string;
  createdBy?: string;
  type: StreamType;
  title?: string;
  content?: string;
  learningMaterialId?: string;
  classroomAssignmentId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type PlatformRoleCode = "super_admin_platform" | "support_admin" | "finance_admin";
export type TenantRoleCode = "school_owner" | "school_admin" | "teacher" | "student" | "parent";
export type RoleCode = PlatformRoleCode | TenantRoleCode;
