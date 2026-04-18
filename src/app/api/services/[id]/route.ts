import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const db = getDb();
    db.prepare('UPDATE services SET title = ?, description = ?, icon = ?, sort_order = ?, active = ? WHERE id = ?')
      .run(body.title, body.description, body.icon, body.sort_order, body.active ? 1 : 0, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 });
  }
}
