import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('property_id');
    const db = getDb();
    if (propertyId) {
      const amenities = db.prepare(`
        SELECT a.*, CASE WHEN pa.amenity_id IS NOT NULL THEN 1 ELSE 0 END as selected
        FROM odarota_amenities a
        LEFT JOIN odarota_property_amenities pa ON pa.amenity_id = a.id AND pa.property_id = ?
        WHERE a.active = 1
        ORDER BY a.amenity_group ASC, a.sort_order ASC
      `).all(propertyId);
      return NextResponse.json(amenities);
    }
    return NextResponse.json({ error: 'property_id gerekli' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { property_id, amenity_ids } = await request.json();
    if (!property_id || !Array.isArray(amenity_ids)) {
      return NextResponse.json({ error: 'property_id ve amenity_ids gerekli' }, { status: 400 });
    }
    const db = getDb();
    db.prepare('DELETE FROM odarota_property_amenities WHERE property_id = ?').run(property_id);
    const insert = db.prepare('INSERT OR IGNORE INTO odarota_property_amenities (property_id, amenity_id) VALUES (?, ?)');
    const txn = db.transaction((ids: number[]) => {
      for (const aid of ids) {
        insert.run(property_id, aid);
      }
    });
    txn(amenity_ids);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}
