import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const db = getDb();
    db.prepare('UPDATE odarota_amenities SET name = ?, icon = ?, amenity_group = ?, sort_order = ?, active = ? WHERE id = ?')
      .run(body.name, body.icon, body.amenity_group, body.sort_order, body.active ? 1 : 0, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    db.prepare('DELETE FROM odarota_property_amenities WHERE amenity_id = ?').run(id);
    db.prepare('DELETE FROM odarota_amenities WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 });
  }
}
