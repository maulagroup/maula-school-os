import { demoSchool } from '@/lib/demo/data';

export default function PPDBLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-3xl"
            style={{ backgroundColor: '#3b82f6' }}
          >
            {demoSchool.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PPDB {demoSchool.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Pendaftaran Peserta Didik Baru Tahun Ajaran 2024/2025
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-primary-600 mb-2">SD</div>
              <p className="text-gray-600">Sekolah Dasar</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-success-600 mb-2">SMP</div>
              <p className="text-gray-600">Sekolah Menengah Pertama</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">SMA/SMK</div>
              <p className="text-gray-600">Sekolah Menengah Atas/Kejuruan</p>
            </div>
          </div>
          
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            Daftar Sekarang
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Jadwal Pendaftaran</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="font-medium text-gray-700">Pendaftaran Gelombang 1</span>
                <span className="text-primary-600">01 Jan - 28 Feb 2024</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="font-medium text-gray-700">Pendaftaran Gelombang 2</span>
                <span className="text-primary-600">01 Mar - 30 Apr 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Pengumuman Hasil</span>
                <span className="text-success-600">15 Mei 2024</span>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Persyaratan</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Fotokopi Akta Kelahiran</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Fotokopi Kartu Keluarga</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Fotokopi Ijazah Sebelumnya</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Pas Foto 3x4 (3 lembar)</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Butuh bantuan? Hubungi kami di <span className="font-medium text-primary-600">{demoSchool.phone}</span> atau <span className="font-medium text-primary-600">{demoSchool.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
