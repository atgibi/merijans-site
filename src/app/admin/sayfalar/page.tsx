'use client';

import { useState, useEffect } from 'react';

interface Page { id: number; slug: string; title: string; content: string; meta_description: string }

export default function AdminSayfalar() {
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<{ id: number; name: string; email: string; message: string; created_at: string; read: number }[]>([]);

  useEffect(() => {
    fetch('/api/pages').then(r => r.json()).then(setPages);
    fetch('/api/contact').then(r => r.json()).then(setMessages);
  }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    await fetch(`/api/pages/${editing.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    const updated = await fetch('/api/pages').then(r => r.json());
    setPages(updated);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Sayfa Yönetimi</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pages */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Sayfalar</h2>
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">{page.title}</h3>
                  <span className="text-xs text-slate-400">/{page.slug}</span>
                </div>
                <button
                  onClick={() => setEditing({ ...page })}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Düzenle
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            İletişim Mesajları
            {messages.filter(m => !m.read).length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                {messages.filter(m => !m.read).length} okunmamış
              </span>
            )}
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-slate-400 text-sm">Henüz mesaj yok.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">{msg.name}</h3>
                      <span className="text-xs text-slate-400">{msg.email} · {new Date(msg.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                  </div>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Sayfa Düzenle: {editing.title}</h2>
              <button onClick={() => setEditing(null)} className="p-2 text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İçerik (HTML)</label>
                <textarea
                  rows={10}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Açıklama</label>
                <input
                  type="text"
                  value={editing.meta_description}
                  onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="SEO için kısa açıklama"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                İptal
              </button>
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
