'use client';

import { useState, useEffect } from 'react';

interface Amenity {
  id: number; name: string; icon: string; amenity_group: string;
  sort_order: number; active: number; property_count: number;
}

const groups = [
  { value: 'indoor', label: 'İç Mekan' },
  { value: 'outdoor', label: 'Dış Mekan' },
  { value: 'services', label: 'Hizmetler' },
  { value: 'accessibility', label: 'Erişilebilirlik' },
  { value: 'genel', label: 'Genel' },
];

const icons = [
  'wifi', 'snowflake', 'flame', 'tv', 'wine', 'lock', 'wind',
  'droplet', 'sun', 'tree', 'home', 'maximize', 'car',
  'utensils', 'heart', 'dumbbell', 'users', 'bell', 'shirt', 'plane',
  'paw-print', 'baby', 'accessibility', 'coffee', 'cigarette', 'zap',
  'check', 'star', 'shield', 'globe', 'map-pin',
];

export default function AdminAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [editing, setEditing] = useState<Amenity | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterGroup, setFilterGroup] = useState('all');

  const load = async () => {
    const data = await fetch('/api/odarota/amenities').then(r => r.json());
    setAmenities(data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      await fetch('/api/odarota/amenities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
    } else {
      await fetch(`/api/odarota/amenities/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
    }
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Bu özelliği silmek istediğinize emin misiniz? Tüm tesislerden de kaldırılacak.')) return;
    await fetch(`/api/odarota/amenities/${id}`, { method: 'DELETE' });
    load();
  };

  const toggleActive = async (item: Amenity) => {
    await fetch(`/api/odarota/amenities/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, active: item.active ? 0 : 1 }),
    });
    load();
  };

  const filtered = filterGroup === 'all' ? amenities : amenities.filter(a => a.amenity_group === filterGroup);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tesis Özellikleri</h1>
          <p className="text-sm text-slate-500 mt-1">Tesis başvuru formunda görünecek özellikleri yönetin</p>
        </div>
        <button
          onClick={() => {
            setEditing({ id: 0, name: '', icon: 'check', amenity_group: 'genel', sort_order: amenities.length + 1, active: 1, property_count: 0 });
            setIsNew(true);
          }}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:shadow-lg transition-all"
        >
          + Yeni Özellik
        </button>
      </div>

      {/* Group filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterGroup('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterGroup === 'all' ? 'bg-indigo-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Tümü ({amenities.length})
        </button>
        {groups.map(g => (
          <button
            key={g.value}
            onClick={() => setFilterGroup(g.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterGroup === g.value ? 'bg-indigo-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {g.label} ({amenities.filter(a => a.amenity_group === g.value).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Özellik</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">İkon</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Grup</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Tesis</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Sıra</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Aktif</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">{item.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{item.icon}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                    {groups.find(g => g.value === item.amenity_group)?.label || item.amenity_group}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-slate-600 font-medium">{item.property_count}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-slate-600">{item.sort_order}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleActive(item)} className="transition-transform hover:scale-110">
                    {item.active ? (
                      <span className="text-emerald-500 text-lg">✓</span>
                    ) : (
                      <span className="text-slate-300 text-lg">○</span>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded transition-colors">Düzenle</button>
                  <button onClick={() => remove(item.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors ml-1">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">Bu grupta özellik yok.</div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Toplam {amenities.length} özellik — Aktif: {amenities.filter(a => a.active).length}
      </p>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">{isNew ? 'Yeni Özellik' : 'Özelliği Düzenle'}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Özellik Adı</label>
                <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Örn: Jakuzi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İkon</label>
                <div className="grid grid-cols-8 gap-2 mb-2">
                  {icons.map(ic => (
                    <button
                      key={ic}
                      onClick={() => setEditing({ ...editing, icon: ic })}
                      className={`p-2 rounded-lg border text-xs font-mono transition-all ${editing.icon === ic ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
                <input type="text" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono" placeholder="veya özel ikon adı yazın" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Grup</label>
                  <select value={editing.amenity_group} onChange={(e) => setEditing({ ...editing, amenity_group: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none bg-white">
                    {groups.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sıralama</label>
                  <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked ? 1 : 0 })} className="rounded" />
                <span className="text-sm text-slate-700">Aktif (formda görünsün)</span>
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
