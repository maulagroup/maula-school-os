export const demoSchool = {
  name: "SMA Negeri 1 Maula",
  address: "Jl. Pendidikan No. 123, Jakarta",
  phone: "(021) 1234-5678",
  email: "info@sman1maula.sch.id",
};

export const demoStats = {
  students: 324,
  teachers: 42,
  classes: 12,
  attendanceToday: {
    present: 310,
    absent: 8,
    sick: 4,
    permission: 2,
  },
  assignmentsPending: 5,
  onboardingProgress: 60,
};

export const demoTeachers = [
  { id: "1", name: "Budi Santoso", subject: "Matematika", nip: "198501012010011001" },
  { id: "2", name: "Siti Nurhaliza", subject: "Bahasa Indonesia", nip: "198805152012012002" },
  { id: "3", name: "Ahmad Fauzi", subject: "IPA", nip: "198208202008011003" },
  { id: "4", name: "Dewi Lestari", subject: "IPS", nip: "199003102015012004" },
];

export const demoStudents = [
  { id: "1", name: "Andi Pratama", nis: "202101001", class: "X IPA 1" },
  { id: "2", name: "Citra Permata", nis: "202101002", class: "X IPA 1" },
  { id: "3", name: "Dimas Putra", nis: "202101003", class: "X IPA 2" },
  { id: "4", name: "Eka Sari", nis: "202101004", class: "X IPS 1" },
  { id: "5", name: "Fajar Wijaya", nis: "202101005", class: "X IPS 2" },
];

export const demoClasses = [
  { id: "1", name: "X IPA 1", grade: 10, homeroom: "Budi Santoso", students: 27 },
  { id: "2", name: "X IPA 2", grade: 10, homeroom: "Siti Nurhaliza", students: 26 },
  { id: "3", name: "X IPS 1", grade: 10, homeroom: "Ahmad Fauzi", students: 25 },
  { id: "4", name: "X IPS 2", grade: 10, homeroom: "Dewi Lestari", students: 24 },
  { id: "5", name: "XI IPA 1", grade: 11, homeroom: "Budi Santoso", students: 28 },
  { id: "6", name: "XI IPA 2", grade: 11, homeroom: "Siti Nurhaliza", students: 27 },
];

export interface DemoActivity {
  id: string;
  type: "attendance" | "lms" | "grading" | "onboarding";
  title: string;
  description: string;
  time: string;
}

export const demoActivityFeed: DemoActivity[] = [
  {
    id: "1",
    type: "attendance",
    title: "Absensi Hari Ini",
    description: "310 siswa hadir, 8 tidak hadir",
    time: "Baru saja",
  },
  {
    id: "2",
    type: "lms",
    title: "Materi Baru",
    description: "Pak Budi upload materi Matematika Bab 5",
    time: "2 jam lalu",
  },
  {
    id: "3",
    type: "grading",
    title: "Penilaian Diperbarui",
    description: "Bu Siti publish nilai Ulangan Harian 2",
    time: "5 jam lalu",
  },
  {
    id: "4",
    type: "onboarding",
    title: "Setup Selesai",
    description: "Kelas XI IPA 1 berhasil ditambahkan",
    time: "Kemarin",
  },
];
