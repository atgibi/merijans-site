import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    let query = `
      SELECT a.*, 
        (SELECT COUNT(*) FROM odarota_property_amenities WHERE amenity_id = a.id) as property_count
      FROM odarota_amenities a
    `;
    if (activeOnly) query += ' WHERE a.active = 1';
    query += ' ORDER BY a.amenity_group ASC, a.sort_order ASC';
    const amenities = db.prepare(query).all();
    return NextResponse.json(amenities);
  } catch (error) {
    return NextResponse.json({ error: 'Özellikler yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const result = db.prepare(
      'INSERT INTO odarota_amenities (name, icon, amenity_group, sort_order, active) VALUES (?, ?, ?, ?, ?)'
    ).run(body.name, body.icon || 'check', body.amenity_group || 'genel', body.sort_order || 0, body.active ?? 1);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Özellik eklenemedi' }, { status: 500 });
  }
}
