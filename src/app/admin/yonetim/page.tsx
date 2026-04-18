'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  pages: number;
  services: number;
  posts: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ pages: 0, services: 0, posts: 0, messages: 0, unreadMessages: 0 });

  useEffect(() => {
    async function load() {
      const [pages, services, posts, messages] = await Promise.all([
        fetch('/api/pages').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/blog').then(r => r.json()),
        fetch('/api/contact').then(r => r.json()),
      ]);
      setStats({
        pages: pages.length,
        services: services.length,
        posts: posts.length,
        messages: messages.length,
        unreadMessages: messages.filter((m: { read: number }) => !m.read).length,
      });
    }
    load();
  }, []);

  const cards = [
    { label: 'Sayfalar', value: stats.pages, href: '/admin/sayfalar', color: 'from-sky-500 to-sky-600' },
    { label: 'Hizmetler', value: stats.services, href: '/admin/hizmetler', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Blog Yazıları', value: stats.posts, href: '/admin/blog', color: 'from-purple-500 to-purple-600' },
    { label: 'İletişim', value: stats.messages, href: '/admin/sayfalar', color: 'from-emerald-500 to-emerald-600', badge: stats.unreadMessages },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Genel Bakış</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="relative group">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-4`}>
                <span className="text-white font-bold text-lg">{card.value}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-500">{card.label}</h3>
              {card.badge ? (
                <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {card.badge}
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <Link href="/admin/blog" className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
          <h3 className="font-semibold mb-1">Yeni Blog Yazısı</h3>
          <p className="text-indigo-100 text-sm">Yeni bir blog yazısı oluşturun</p>
        </Link>
        <Link href="/admin/hizmetler" className="p-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300">
          <h3 className="font-semibold mb-1">Hizmet Yönetimi</h3>
          <p className="text-sky-100 text-sm">Hizmetlerinizi düzenleyin</p>
        </Link>
      </div>
    </div>
  );
}
