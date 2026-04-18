import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const property = db.prepare('SELECT * FROM odarota_properties WHERE id = ?').get(id);
    if (!property) return NextResponse.json({ error: 'Tesis bulunamadı' }, { status: 404 });
    const media = db.prepare('SELECT * FROM odarota_media WHERE property_id = ? ORDER BY sort_order ASC').all(id);
    return NextResponse.json({ ...property as object, media });
  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const db = getDb();
    const boolFields = ['pool', 'beach', 'spa', 'restaurant', 'parking', 'wifi', 'ac', 'gym', 'meeting_room', 'pet_friendly'];

    const fields = [
      'facility_name', 'facility_type', 'province', 'district', 'address', 'latitude', 'longitude',
      'owner_name', 'owner_phone', 'owner_email', 'owner_alt_phone', 'website',
      'social_instagram', 'social_facebook',
      'star_rating', 'room_count', 'bed_count',
      'pool', 'beach', 'spa', 'restaurant', 'parking', 'wifi', 'ac', 'gym', 'meeting_room', 'pet_friendly',
      'price_range', 'capacity', 'check_in_time', 'check_out_time',
      'short_description', 'full_description', 'amenities', 'nearby_attractions',
      'cancellation_policy', 'special_notes', 'status', 'admin_notes'
    ];

    const sets: string[] = [];
    const values: Record<string, string> = {};

    for (const f of fields) {
      if (body[f] !== undefined) {
        sets.push(`${f} = @${f}`);
        values[f] = boolFields.includes(f) ? (body[f] ? '1' : '0') : String(body[f]);
      }
    }

    if (sets.length > 0) {
      sets.push('updated_at = CURRENT_TIMESTAMP');
      db.prepare(`UPDATE odarota_properties SET ${sets.join(', ')} WHERE id = @id`).run({ ...values, id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    db.prepare('DELETE FROM odarota_media WHERE property_id = ?').run(id);
    db.prepare('DELETE FROM odarota_properties WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 });
  }
}
