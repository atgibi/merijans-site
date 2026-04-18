'use client';

import { useState, useEffect } from 'react';

interface Post { id: number; slug: string; title: string; excerpt: string; content: string; cover_image: string; published: number; created_at: string }

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(setPosts);
  }, []);

  const reload = () => fetch('/api/blog').then(r => r.json()).then(setPosts);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
    } else {
      await fetch(`/api/blog/${editing.id}`, {
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
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Blog Yazıları</h1>
        <button
          onClick={() => {
            setEditing({ id: 0, slug: '', title: '', excerpt: '', content: '', cover_image: '', published: 0, created_at: '' });
            setIsNew(true);
          }}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:shadow-lg transition-all"
        >
          + Yeni Yazı
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-400">Henüz blog yazısı yok.</p>
          <p className="text-slate-300 text-sm mt-1">Yeni yazı oluşturmak için yukarıdaki butonu kullanın.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${post.published ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <div>
                  <h3 className="font-medium text-slate-900">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>/{post.slug}</span>
                    <span>·</span>
                    <span>{post.published ? 'Yayında' : 'Taslak'}</span>
                    {post.created_at && (
                      <>
                        <span>·</span>
                        <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditing({ ...post }); setIsNew(false); }} className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">Düzenle</button>
                <button onClick={() => remove(post.id)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">{isNew ? 'Yeni Blog Yazısı' : 'Yazıyı Düzenle'}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9ğüşıöçĞÜŞIÖÇ]+/g, '-').replace(/^-|-$/g, '') })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                <input type="text" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Özet</label>
                <textarea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none resize-none" placeholder="Kısa özet..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İçerik (HTML)</label>
                <textarea rows={12} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none font-mono text-sm" placeholder="<p>İçeriğinizi buraya yazın...</p>" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked ? 1 : 0 })} className="rounded" />
                <span className="text-sm text-slate-700">Yayında</span>
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
