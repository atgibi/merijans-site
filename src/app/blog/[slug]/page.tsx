import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';

function getPost(slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM blog_posts WHERE slug = ? AND published = 1').get(slug) as {
    title: string; content: string; created_at: string; excerpt: string;
  } | undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? `${post.title} | Merijans Blog` : 'Yazı Bulunamadı' };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
            ← Blog&apos;a Dön
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4">{post.title}</h1>
          <time className="text-slate-400 text-sm mt-2 block">
            {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
        </div>
      </section>

      <section className="py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </section>
    </>
  );
}
