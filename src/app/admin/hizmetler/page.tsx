'use client';

import { useState, useEffect } from 'react';

interface Service { id: number; title: string; description: string; icon: string; sort_order: number; active: number }

export default function AdminHizmetler() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  const reload = () => fetch('/api/services').then(r => r.json()).then(setServices);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
    } else {
      await fetch(`/api/services/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
    }
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    reload();
  };

  const remove = async (id: number) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    reload();
  };

  const icons = ['compass', 'building', 'briefcase', 'users', 'file-text', 'calendar'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hizmet Yönetimi</h1>
        <button
          onClick={() => { setEditing({ id: 0, title: '', description: '', icon: 'compass', sort_order: services.length + 1, active: 1 }); setIsNew(true); }}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:shadow-lg transition-all"
        >
          + Yeni Hizmet
        </button>
      </div>

      <div className="space-y-3">
        {services.map((svc) => (
          <div key={svc.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${svc.active ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
                <span className="text-xs font-bold">{svc.sort_order}</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{svc.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{svc.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!svc.active && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Pasif</span>}
              <button onClick={() => { setEditing({ ...svc }); setIsNew(false); }} className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">Düzenle</button>
              <button onClick={() => remove(svc.id)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Sil</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">{isNew ? 'Yeni Hizmet' : 'Hizmeti Düzenle'}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">İkon</label>
                  <select value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none">
                    {icons.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sıralama</label>
                  <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked ? 1 : 0 })} className="rounded" />
                <span className="text-sm text-slate-700">Aktif (sitede görünsün)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">İptal</button>
              <button onClick={save} disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
