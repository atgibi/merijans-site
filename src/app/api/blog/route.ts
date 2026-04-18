import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    let query = 'SELECT * FROM blog_posts';
    const params: string[] = [];
    if (published === 'true') {
      query += ' WHERE published = 1';
    }
    query += ' ORDER BY created_at DESC';
    const posts = db.prepare(query).all(...params);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Yazılar yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9ğüşıöçĞÜŞIÖÇ]+/g, '-').replace(/^-|-$/g, '');
    const result = db.prepare(
      'INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, published) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(slug, body.title, body.excerpt || '', body.content || '', body.cover_image || '', body.published ? 1 : 0);
    return NextResponse.json({ id: result.lastInsertRowid, slug });
  } catch (error) {
    return NextResponse.json({ error: 'Yazı oluşturulamadı' }, { status: 500 });
  }
}
