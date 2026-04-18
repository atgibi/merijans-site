import Link from 'next/link';
import { getDb } from '@/lib/db';

function getServices() {
  const db = getDb();
  return db.prepare('SELECT * FROM services WHERE active = 1 ORDER BY sort_order ASC').all() as {
    id: number; title: string; description: string; icon: string;
  }[];
}

function getSettings() {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.key] = row.value;
  return settings;
}

export default async function HomePage() {
  const services = getServices();
  const settings = getSettings();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99,102,241,0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(14,165,233,0.3) 0%, transparent 50%)`
          }} />
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ankara merkezli turizm danışmanlığı
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Hayalinizdeki{' '}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Seyahati
              </span>
              <br />
              Planlıyoruz
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mb-10">
              Profesyonel ekibimizle kişiselleştirilmiş seyahat deneyimleri tasarlıyoruz.
              Kurumsal ve bireysel seyahat ihtiyaçlarınız için tek adres.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/hizmetlerimiz"
                className="group px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Hizmetlerimizi Keşfet
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/iletisim"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-1/4 right-12 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '3+', label: 'Yıllık Deneyim' },
              { number: '500+', label: 'Mutlu Müşteri' },
              { number: '50+', label: 'Destinasyon' },
              { number: '%98', label: 'Memnuniyet Oranı' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-500 tracking-wider uppercase">Hizmetlerimiz</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Size Özel Turizm Çözümleri
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Bireysel ve kurumsal müşterilerimiz için kapsamlı seyahat danışmanlığı hizmetleri sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group p-8 rounded-2xl bg-white border border-slate-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center mb-5 group-hover:from-sky-100 group-hover:to-indigo-100 transition-colors">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/hizmetlerimiz"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Tüm Hizmetlerimiz
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-indigo-500 tracking-wider uppercase">Neden Biz?</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-6">
                Profesyonel Yaklaşım,<br />Kişisel Deneyim
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Kişiselleştirilmiş Hizmet', desc: 'Her müşterimizin ihtiyaçlarına özel çözümler üretiyoruz.' },
                  { title: 'Sektör Deneyimi', desc: 'Turizm sektöründeki derin bilgi birikimimizle en iyi seçenekleri sunuyoruz.' },
                  { title: '7/24 Destek', desc: 'Seyahatiniz boyunca her an yanınızdayız.' },
                  { title: 'En İyi Fiyat Garantisi', desc: 'Güçlü iş ortaklıklarımız sayesinde rekabetçi fiyatlar sunuyoruz.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">Dünya genelinde<br />50+ destinasyon</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Seyahatinizi Planlamaya Başlayalım
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Bize ulaşın, hayalinizdeki seyahati birlikte planlayalım. Ücretsiz danışmanlık için hemen iletişime geçin.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex px-8 py-4 bg-white text-indigo-900 font-semibold rounded-full hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            Hemen İletişime Geçin
          </Link>
        </div>
      </section>
    </>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const cls = "w-7 h-7 text-indigo-500";
  const props = { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 };
  switch (name) {
    case 'compass':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
    case 'building':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" /></svg>;
    case 'briefcase':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>;
    case 'users':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>;
    case 'file-text':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
    case 'calendar':
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
    default:
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
  }
}
