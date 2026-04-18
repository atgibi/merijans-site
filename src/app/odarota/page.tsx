'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';

const facilityTypes = [
  'Otel', 'Butik Otel', 'Pansiyon', 'Tatil Köyü', 'Apart Otel',
  'Kamp Alanı', 'Villa', 'Bungalov', 'Dağ Evi', 'Ağaç Ev',
  'Glamping', 'Resort', 'Hostel', 'Diğer'
];

const provinces = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin',
  'Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur',
  'Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan',
  'Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul',
  'İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale','Kırklareli','Kırşehir',
  'Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş',
  'Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Şanlıurfa','Siirt','Sinop',
  'Sivas','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak'
];

export default function OdarotaFormPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; path: string }[]>([]);

  const [form, setForm] = useState({
    facility_name: '', facility_type: '', province: '', district: '', address: '',
    latitude: '', longitude: '',
    owner_name: '', owner_phone: '', owner_email: '', owner_alt_phone: '', website: '',
    social_instagram: '', social_facebook: '',
    star_rating: '', room_count: '', bed_count: '',
    pool: false, beach: false, spa: false, restaurant: false, parking: false,
    wifi: false, ac: false, gym: false, meeting_room: false, pet_friendly: false,
    price_range: '', capacity: '', check_in_time: '14:00', check_out_time: '12:00',
    short_description: '', full_description: '', amenities: '',
    nearby_attractions: '', cancellation_policy: '', special_notes: '',
  });

  const set = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/odarota/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setPropertyId(data.id);
        setSubmitted(true);
        setStep(5); // Upload step
      }
    } catch (e) {
      alert('Hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!propertyId || !files.length) return;
    setUploadingFiles(true);
    const fd = new FormData();
    fd.append('property_id', String(propertyId));
    for (let i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
    }
    try {
      const res = await fetch('/api/odarota/media', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setUploadedFiles(prev => [...prev, ...data.files.map((f: { name: string; path: string }) => ({ name: f.name, path: f.path }))]);
      }
    } catch (e) {
      alert('Yükleme hatası');
    } finally {
      setUploadingFiles(false);
    }
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo className="h-9" />
          <span className="text-sm text-slate-500">Odarota Tesis Başvurusu</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {submitted && step === 6 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Başvurunuz Alındı!</h1>
            <p className="text-slate-500 max-w-md mx-auto">
              Tesis bilgileriniz başarıyla kaydedildi. Ekibimiz en kısa sürede başvurunuzu inceleyecek ve sizinle iletişime geçecektir.
            </p>
            <p className="text-sm text-slate-400 mt-4">Başvuru No: #{propertyId}</p>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {['Tesis Bilgileri', 'İletişim', 'Özellikler', 'Açıklama', 'Fotoğraf/Video'].map((label, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i + 1 < step || (submitted && i + 1 <= 5)) setStep(i + 1);
                    }}
                    className={`flex flex-col items-center text-xs ${step === i + 1 ? 'text-indigo-600 font-semibold' : step > i + 1 ? 'text-emerald-500' : 'text-slate-400'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm font-bold ${
                      step === i + 1 ? 'bg-indigo-500 text-white' : step > i + 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    <span className="hidden sm:block">{label}</span>
                  </button>
                ))}
              </div>
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300 rounded-full" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
              </div>
            </div>

            {/* Step 1: Facility Info */}
            {step === 1 && (
              <Section title="Tesis Bilgileri" subtitle="Tesisinizin temel bilgilerini girin">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Tesis Adı *" value={form.facility_name} onChange={v => set('facility_name', v)} placeholder="Örn: Deniz Pansiyon" required />
                  <Select label="Tesis Tipi" value={form.facility_type} onChange={v => set('facility_type', v)} options={facilityTypes} />
                  <Select label="İl" value={form.province} onChange={v => set('province', v)} options={provinces} />
                  <Input label="İlçe" value={form.district} onChange={v => set('district', v)} placeholder="İlçe adı" />
                </div>
                <Input label="Açık Adres" value={form.address} onChange={v => set('address', v)} placeholder="Mahalle, cadde, sokak, bina no..." textarea />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Enlem (Latitude)" value={form.latitude} onChange={v => set('latitude', v)} placeholder="Opsiyonel - Google Maps'ten" />
                  <Input label="Boylam (Longitude)" value={form.longitude} onChange={v => set('longitude', v)} placeholder="Opsiyonel" />
                </div>
                <NavButtons onNext={() => setStep(2)} />
              </Section>
            )}

            {/* Step 2: Contact */}
            {step === 2 && (
              <Section title="İletişim Bilgileri" subtitle="Size ulaşabilmemiz için iletişim bilgilerinizi girin">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Yetkili Ad Soyad *" value={form.owner_name} onChange={v => set('owner_name', v)} placeholder="Adınız Soyadınız" required />
                  <Input label="Telefon *" value={form.owner_phone} onChange={v => set('owner_phone', v)} placeholder="+90 5xx xxx xx xx" required />
                  <Input label="E-posta *" value={form.owner_email} onChange={v => set('owner_email', v)} placeholder="ornek@email.com" type="email" required />
                  <Input label="Alternatif Telefon" value={form.owner_alt_phone} onChange={v => set('owner_alt_phone', v)} placeholder="İsteğe bağlı" />
                  <Input label="Web Sitesi" value={form.website} onChange={v => set('website', v)} placeholder="https://..." />
                </div>
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Sosyal Medya</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Instagram" value={form.social_instagram} onChange={v => set('social_instagram', v)} placeholder="@kullaniciadi" />
                    <Input label="Facebook" value={form.social_facebook} onChange={v => set('social_facebook', v)} placeholder="Sayfa URL'si" />
                  </div>
                </div>
                <NavButtons onPrev={() => setStep(1)} onNext={() => setStep(3)} />
              </Section>
            )}

            {/* Step 3: Features */}
            {step === 3 && (
              <Section title="Tesis Özellikleri" subtitle="Tesisinizin sunduğu imkanları işaretleyin">
                <div className="grid sm:grid-cols-3 gap-4">
                  <Select label="Yıldız" value={form.star_rating} onChange={v => set('star_rating', v)} options={['1', '2', '3', '4', '5']} />
                  <Input label="Oda Sayısı" value={form.room_count} onChange={v => set('room_count', v)} placeholder="Örn: 24" type="number" />
                  <Input label="Yatak Sayısı" value={form.bed_count} onChange={v => set('bed_count', v)} placeholder="Örn: 48" type="number" />
                  <Input label="Kapasite" value={form.capacity} onChange={v => set('capacity', v)} placeholder="Max kişi sayısı" />
                  <Input label="Fiyat Aralığı" value={form.price_range} onChange={v => set('price_range', v)} placeholder="Örn: 500-2000 ₺/gece" />
                </div>

                <h3 className="text-sm font-semibold text-slate-700 mt-6 mb-3">Olanaklar</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { key: 'pool', label: 'Havuz' },
                    { key: 'beach', label: 'Plaj' },
                    { key: 'spa', label: 'Spa/Wellness' },
                    { key: 'restaurant', label: 'Restoran' },
                    { key: 'parking', label: 'Otopark' },
                    { key: 'wifi', label: 'Wi-Fi' },
                    { key: 'ac', label: 'Klima' },
                    { key: 'gym', label: 'Spor Salonu' },
                    { key: 'meeting_room', label: 'Toplantı Salonu' },
                    { key: 'pet_friendly', label: 'Evcil Hayvan' },
                  ].map(f => (
                    <label key={f.key} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      form[f.key as keyof typeof form] ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="checkbox" checked={form[f.key as keyof typeof form] as boolean} onChange={e => set(f.key, e.target.checked)} className="sr-only" />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${form[f.key as keyof typeof form] ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                        {form[f.key as keyof typeof form] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-sm">{f.label}</span>
                    </label>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <Input label="Check-in Saati" value={form.check_in_time} onChange={v => set('check_in_time', v)} placeholder="14:00" />
                  <Input label="Check-out Saati" value={form.check_out_time} onChange={v => set('check_out_time', v)} placeholder="12:00" />
                </div>
                <NavButtons onPrev={() => setStep(2)} onNext={() => setStep(4)} />
              </Section>
            )}

            {/* Step 4: Description */}
            {step === 4 && (
              <Section title="Açıklama ve Detaylar" subtitle="Tesisinizi detaylı olarak tanıtın">
                <Input label="Kısa Açıklama" value={form.short_description} onChange={v => set('short_description', v)} placeholder="Tesisinizi 1-2 cümle ile tanıtın..." textarea rows={3} />
                <Input label="Detaylı Açıklama" value={form.full_description} onChange={v => set('full_description', v)} placeholder="Tesisiniz hakkında detaylı bilgi..." textarea rows={6} />
                <Input label="Olanaklar (Virgülle ayırın)" value={form.amenities} onChange={v => set('amenities', v)} placeholder="Örn: 24 saat resepsiyon, oda servisi, çamaşırhane..." textarea rows={3} />
                <Input label="Yakın Çevre / Gezi Noktaları" value={form.nearby_attractions} onChange={v => set('nearby_attractions', v)} placeholder="Yakındaki turistik yerler, mesafeleriyle birlikte..." textarea rows={3} />
                <Input label="İptal Politikası" value={form.cancellation_policy} onChange={v => set('cancellation_policy', v)} placeholder="İptal ve iade koşulları..." textarea rows={3} />
                <Input label="Özel Notlar" value={form.special_notes} onChange={v => set('special_notes', v)} placeholder="Eklemek istediğiniz diğer bilgiler..." textarea rows={3} />
                <NavButtons onPrev={() => setStep(3)} onNext={handleSubmit} nextLabel="Kaydet ve Devam Et" loading={submitting} />
              </Section>
            )}

            {/* Step 5: File Upload */}
            {step === 5 && (
              <Section title="Fotoğraf ve Video Yükleme" subtitle="Tesisinizin fotoğraflarını ve videolarını yükleyin">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium">Dosyaları sürükleyin veya tıklayın</p>
                    <p className="text-sm text-slate-400 mt-1">JPG, PNG, WEBP, MP4 — Birden fazla dosya seçebilirsiniz</p>
                  </label>
                </div>

                {uploadingFiles && (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-sm text-slate-500">Yükleniyor...</span>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Yüklenen Dosyalar ({uploadedFiles.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                          {f.path.match(/\.(mp4|webm|mov)$/i) ? (
                            <div className="text-center">
                              <svg className="w-8 h-8 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                              </svg>
                              <span className="text-xs text-slate-500 mt-1 block truncate px-1">{f.name}</span>
                            </div>
                          ) : (
                            <img src={f.path} alt={f.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => document.getElementById('file-upload')?.click()} className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      + Daha fazla dosya ekle
                    </button>
                  </div>
                )}

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setStep(6)}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Başvuruyu Tamamla ✓
                  </button>
                </div>
              </Section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      <div className="space-y-4 mt-6">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', textarea, rows = 4, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; textarea?: boolean; rows?: number; required?: boolean;
}) {
  const cls = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm";
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {textarea ? (
        <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls + ' resize-none'} required={required} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} required={required} />
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm bg-white">
        <option value="">Seçiniz</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function NavButtons({ onPrev, onNext, nextLabel = 'Devam Et', loading }: {
  onPrev?: () => void; onNext?: () => void; nextLabel?: string; loading?: boolean;
}) {
  return (
    <div className="flex justify-between pt-4">
      {onPrev ? (
        <button onClick={onPrev} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          ← Geri
        </button>
      ) : <div />}
      <button onClick={onNext} disabled={loading} className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50">
        {loading ? 'Kaydediliyor...' : nextLabel}
      </button>
    </div>
  );
}
