'use client';

import { useState, useEffect } from 'react';

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings);
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { key: 'site_name', label: 'Site Adı', section: 'Genel' },
    { key: 'site_tagline', label: 'Slogan', section: 'Genel' },
    { key: 'phone', label: 'Telefon', section: 'İletişim' },
    { key: 'email', label: 'E-posta', section: 'İletişim' },
    { key: 'address', label: 'Adres', section: 'İletişim' },
    { key: 'instagram', label: 'Instagram URL', section: 'Sosyal Medya' },
    { key: 'facebook', label: 'Facebook URL', section: 'Sosyal Medya' },
    { key: 'twitter', label: 'Twitter/X URL', section: 'Sosyal Medya' },
    { key: 'linkedin', label: 'LinkedIn URL', section: 'Sosyal Medya' },
  ];

  const sections = [...new Set(fields.map(f => f.section))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Site Ayarları</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600 font-medium">✓ Kaydedildi</span>}
          <button onClick={save} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section} className="p-6 rounded-2xl bg-white border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">{section}</h2>
            <div className="space-y-4">
              {fields.filter(f => f.section === section).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={settings[field.key] || ''}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-200">
        <h3 className="text-sm font-semibold text-amber-800 mb-2">⚠️ Not</h3>
        <p className="text-sm text-amber-700">
          Site adı ve slogan değişiklikleri sayfanın yenilenmesiyle görünür olacaktır.
          Sosyal medya linkleri footer&apos;da ve iletişim sayfasında kullanılmaktadır.
        </p>
      </div>
    </div>
  );
}
