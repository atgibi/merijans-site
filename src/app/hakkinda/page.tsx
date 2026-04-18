import { getDb } from '@/lib/db';

function getPage(slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug) as { title: string; content: string } | undefined;
}

export async function generateMetadata() {
  const page = getPage('hakkinda');
  return { title: `${page?.title || 'Hakkımızda'} | Merijans Turizm` };
}

export default function HakkindaPage() {
  const page = getPage('hakkinda');

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">Biz Kimiz?</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2">Hakkımızda</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
          </div>

          <div className="mt-16 grid sm:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Misyonumuz</h3>
              <p className="text-slate-600">
                Müşterilerimize en kaliteli turizm danışmanlığı hizmetini sunarak, unutulmaz
                seyahat deneyimleri yaşamalarını sağlamak.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Vizyonumuz</h3>
              <p className="text-slate-600">
                Türkiye&apos;nin önde gelen turizm danışmanlık firmalarından biri olarak,
                sektörde kalite ve güvenin adresi olmak.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Değerlerimiz</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: 'Güvenilirlik', desc: 'Her sözümüzün arkasında duruyoruz.' },
                { title: 'Kalite', desc: 'En üst düzeyde hizmet sunmayı hedefliyoruz.' },
                { title: 'Müşteri Odaklılık', desc: 'Müşteri memnuniyeti önceliğimizdir.' },
              ].map((val) => (
                <div key={val.title} className="text-center p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-900">{val.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
