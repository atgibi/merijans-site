'use client';

import { useState, useEffect } from 'react';

interface Property {
  id: number; facility_name: string; facility_type: string; province: string; district: string;
  owner_name: string; owner_phone: string; owner_email: string;
  status: string; created_at: string;
}

interface PropertyDetail extends Property {
  address: string; latitude: string; longitude: string;
  owner_alt_phone: string; website: string;
  social_instagram: string; social_facebook: string;
  star_rating: string; room_count: string; bed_count: string;
  pool: string; beach: string; spa: string; restaurant: string; parking: string;
  wifi: string; ac: string; gym: string; meeting_room: string; pet_friendly: string;
  price_range: string; capacity: string;
  check_in_time: string; check_out_time: string;
  short_description: string; full_description: string;
  amenities: string; nearby_attractions: string;
  cancellation_policy: string; special_notes: string;
  admin_notes: string;
  media: { id: number; file_path: string; file_type: string; file_name: string; is_cover: number }[];
}

export default function AdminOdarota() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<PropertyDetail | null>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const url = filter === 'all' ? '/api/odarota/properties' : `/api/odarota/properties?status=${filter}`;
    const data = await fetch(url).then(r => r.json());
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const viewDetail = async (id: number) => {
    const data = await fetch(`/api/odarota/properties/${id}`).then(r => r.json());
    setSelected(data);
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/odarota/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
    if (selected?.id === id) viewDetail(id);
  };

  const deleteProperty = async (id: number) => {
    if (!confirm('Bu tesisi silmek istediğinize emin misiniz? Tüm fotoğraflar da silinecek.')) return;
    await fetch(`/api/odarota/properties/${id}`, { method: 'DELETE' });
    setSelected(null);
    load();
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Beklemede',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Odarota Tesisleri</h1>
          <p className="text-sm text-slate-500 mt-1">odarota.com&apos;a eklenecek tesis başvuruları</p>
        </div>
        <div className="flex gap-2">
          <a href="/api/odarota/export/csv" className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            CSV İndir
          </a>
          <a href="/api/odarota/export" className="px-4 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            JSON İndir
          </a>
          <a href="/odarota" target="_blank" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:shadow-lg transition-all">
            + Başvuru Formu Linki
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Toplam', value: properties.length, filter: 'all' },
          { label: 'Beklemede', value: properties.filter(p => p.status === 'pending').length, filter: 'pending' },
          { label: 'Onaylanan', value: properties.filter(p => p.status === 'approved').length, filter: 'approved' },
          { label: 'Reddedilen', value: properties.filter(p => p.status === 'rejected').length, filter: 'rejected' },
        ].map(s => (
          <button
            key={s.filter}
            onClick={() => setFilter(s.filter)}
            className={`p-4 rounded-xl border text-left transition-all ${filter === s.filter ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          >
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-400">Henüz başvuru yok.</p>
          <a href="/odarota" target="_blank" className="text-indigo-600 text-sm font-medium mt-2 inline-block hover:underline">
            Başvuru formunu paylaş →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map(p => (
            <div key={p.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between hover:shadow-sm transition-all">
              <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => viewDetail(p.id)}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-500">{p.facility_name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{p.facility_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{p.facility_type}</span>
                    {p.province && <><span>·</span><span>{p.province} / {p.district}</span></>}
                    <span>·</span>
                    <span>{new Date(p.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <span className="text-xs text-slate-500">{p.owner_name} — {p.owner_phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-slate-100 text-slate-600'}`}>
                  {statusLabels[p.status] || p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl my-8">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selected.facility_name}</h2>
                  <span className="text-sm text-slate-500">Başvuru #{selected.id} — {new Date(selected.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => updateStatus(selected.id, 'approved')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selected.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>✓ Onayla</button>
                <button onClick={() => updateStatus(selected.id, 'pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selected.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>⏳ Beklemede</button>
                <button onClick={() => updateStatus(selected.id, 'rejected')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selected.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>✗ Reddet</button>
                <button onClick={() => deleteProperty(selected.id)} className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 ml-auto">Sil</button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Media */}
              {selected.media && selected.media.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Fotoğraf & Video ({selected.media.length})</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {selected.media.map(m => (
                      <div key={m.id} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                        {m.file_type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          </div>
                        ) : (
                          <img src={m.file_path} alt={m.file_name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                <InfoSection title="Tesis Bilgileri" items={[
                  ['Tür', selected.facility_type],
                  ['Konum', `${selected.province} / ${selected.district}`],
                  ['Adres', selected.address],
                  ['Yıldız', selected.star_rating],
                  ['Oda', selected.room_count],
                  ['Yatak', selected.bed_count],
                  ['Kapasite', selected.capacity],
                  ['Fiyat', selected.price_range],
                ]} />
                <InfoSection title="İletişim" items={[
                  ['Yetkili', selected.owner_name],
                  ['Telefon', selected.owner_phone],
                  ['E-posta', selected.owner_email],
                  ['Alt Tel', selected.owner_alt_phone],
                  ['Website', selected.website],
                  ['Instagram', selected.social_instagram],
                  ['Facebook', selected.social_facebook],
                ]} />
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Olanaklar</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['pool', 'Havuz'], ['beach', 'Plaj'], ['spa', 'Spa'], ['restaurant', 'Restoran'],
                    ['parking', 'Otopark'], ['wifi', 'Wi-Fi'], ['ac', 'Klima'], ['gym', 'Spor Salonu'],
                    ['meeting_room', 'Toplantı'], ['pet_friendly', 'Evcil Hayvan'],
                  ].map(([key, label]) => (
                    (selected as unknown as Record<string, string>)[key] === '1' && (
                      <span key={key} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">{label}</span>
                    )
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              {selected.short_description && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Kısa Açıklama</h3>
                  <p className="text-sm text-slate-600">{selected.short_description}</p>
                </div>
              )}
              {selected.full_description && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Detaylı Açıklama</h3>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{selected.full_description}</p>
                </div>
              )}
              {selected.amenities && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Olanaklar (Detay)</h3>
                  <p className="text-sm text-slate-600">{selected.amenities}</p>
                </div>
              )}
              {selected.nearby_attractions && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Yakın Çevre</h3>
                  <p className="text-sm text-slate-600">{selected.nearby_attractions}</p>
                </div>
              )}
              {selected.special_notes && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Özel Notlar</h3>
                  <p className="text-sm text-slate-600">{selected.special_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoSection({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50">
      <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>
      <dl className="space-y-1.5">
        {items.filter(([_, v]) => v).map(([k, v]) => (
          <div key={k} className="flex gap-2 text-sm">
            <dt className="text-slate-500 min-w-[80px]">{k}</dt>
            <dd className="text-slate-800 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
