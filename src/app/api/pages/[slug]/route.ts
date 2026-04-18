import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const db = getDb();
    const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
    if (!page) return NextResponse.json({ error: 'Sayfa bulunamadı' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const body = await request.json();
    const db = getDb();
    db.prepare('UPDATE pages SET title = ?, content = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?')
      .run(body.title, body.content, body.meta_description || '', slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}
