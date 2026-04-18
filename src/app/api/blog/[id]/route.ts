import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    if (!post) return NextResponse.json({ error: 'Yazı bulunamadı' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const db = getDb();
    db.prepare(
      'UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(body.title, body.slug, body.excerpt || '', body.content || '', body.cover_image || '', body.published ? 1 : 0, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 });
  }
}
