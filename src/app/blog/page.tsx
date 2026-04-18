import Link from 'next/link';
import { getDb } from '@/lib/db';

function getPublishedPosts() {
  const db = getDb();
  return db.prepare('SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC').all() as {
    id: number; slug: string; title: string; excerpt: string; cover_image: string; created_at: string;
  }[];
}

export async function generateMetadata() {
  return { title: 'Blog | Merijans Turizm Danışmanlık' };
}

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase">Blog</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2">Haberler & Yazılar</h1>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
            Turizm dünyasından haberler, ipuçları ve güncel bilgiler
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Henüz yazı yayınlanmamış</h3>
              <p className="text-slate-500 mt-2">Yakında blog yazılarımız burada yer alacak.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden border border-slate-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-12 h-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    )}
                  </div>
                  <div className="p-6">
                    <time className="text-xs text-slate-400">
                      {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
