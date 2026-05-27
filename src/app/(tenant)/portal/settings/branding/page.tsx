'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/page-header';
import Card from '@/components/ui/card';
import { useBranding } from '@/lib/design-system/context';

export default function BrandingSettingsPage() {
  const { branding, setBranding } = useBranding();
  const [formData, setFormData] = useState({
    logoText: branding.logoText || '',
    primaryColor: branding.primaryColor || '#3b82f6',
    secondaryColor: branding.secondaryColor || '#f97316',
    tagline: branding.tagline || '',
  });

  const handleSave = () => {
    setBranding(formData);
  };

  return (
    <div>
      <PageHeader title="Branding" subtitle="Sesuaikan branding sekolah Anda" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Identitas Sekolah</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  value={formData.logoText}
                  onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Tagline (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Warna Brand</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Warna Utama
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="font-mono text-sm text-secondary-600">{formData.primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Warna Sekunder
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="font-mono text-sm text-secondary-600">{formData.secondaryColor}</span>
                </div>
              </div>
            </div>
          </Card>

          <button
            onClick={handleSave}
            className="w-full px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Simpan Pengaturan
          </button>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Preview</h3>
            <div className="border-2 border-dashed border-secondary-200 rounded-xl p-8 bg-secondary-50">
              <div className="text-center">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  {formData.logoText.charAt(0).toUpperCase()}
                </div>
                <h2 
                  className="text-2xl font-bold mb-1"
                  style={{ color: formData.primaryColor }}
                >
                  {formData.logoText}
                </h2>
                {formData.tagline && (
                  <p className="text-secondary-600">{formData.tagline}</p>
                )}
                <div className="mt-6 flex gap-3 justify-center">
                  <div 
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Primary
                  </div>
                  <div 
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    Secondary
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
