import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    let query = 'SELECT * FROM odarota_properties';
    const params: string[] = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';
    const properties = db.prepare(query).all(...params);
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: 'Tesisler yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    // Booleans
    const boolFields = ['pool', 'beach', 'spa', 'restaurant', 'parking', 'wifi', 'ac', 'gym', 'meeting_room', 'pet_friendly'];

    const result = db.prepare(`
      INSERT INTO odarota_properties (
        facility_name, facility_type, province, district, address, latitude, longitude,
        owner_name, owner_phone, owner_email, owner_alt_phone, website,
        social_instagram, social_facebook,
        star_rating, room_count, bed_count,
        pool, beach, spa, restaurant, parking, wifi, ac, gym, meeting_room, pet_friendly,
        price_range, capacity, check_in_time, check_out_time,
        short_description, full_description, amenities, nearby_attractions,
        cancellation_policy, special_notes
      ) VALUES (
        @facility_name, @facility_type, @province, @district, @address, @latitude, @longitude,
        @owner_name, @owner_phone, @owner_email, @owner_alt_phone, @website,
        @social_instagram, @social_facebook,
        @star_rating, @room_count, @bed_count,
        @pool, @beach, @spa, @restaurant, @parking, @wifi, @ac, @gym, @meeting_room, @pet_friendly,
        @price_range, @capacity, @check_in_time, @check_out_time,
        @short_description, @full_description, @amenities, @nearby_attractions,
        @cancellation_policy, @special_notes
      )
    `).run({
      facility_name: body.facility_name || '',
      facility_type: body.facility_type || '',
      province: body.province || '',
      district: body.district || '',
      address: body.address || '',
      latitude: body.latitude || '',
      longitude: body.longitude || '',
      owner_name: body.owner_name || '',
      owner_phone: body.owner_phone || '',
      owner_email: body.owner_email || '',
      owner_alt_phone: body.owner_alt_phone || '',
      website: body.website || '',
      social_instagram: body.social_instagram || '',
      social_facebook: body.social_facebook || '',
      star_rating: body.star_rating || '',
      room_count: body.room_count || '',
      bed_count: body.bed_count || '',
      pool: boolFields.includes('pool') && body.pool ? '1' : '0',
      beach: body.beach ? '1' : '0',
      spa: body.spa ? '1' : '0',
      restaurant: body.restaurant ? '1' : '0',
      parking: body.parking ? '1' : '0',
      wifi: body.wifi ? '1' : '0',
      ac: body.ac ? '1' : '0',
      gym: body.gym ? '1' : '0',
      meeting_room: body.meeting_room ? '1' : '0',
      pet_friendly: body.pet_friendly ? '1' : '0',
      price_range: body.price_range || '',
      capacity: body.capacity || '',
      check_in_time: body.check_in_time || '14:00',
      check_out_time: body.check_out_time || '12:00',
      short_description: body.short_description || '',
      full_description: body.full_description || '',
      amenities: body.amenities || '',
      nearby_attractions: body.nearby_attractions || '',
      cancellation_policy: body.cancellation_policy || '',
      special_notes: body.special_notes || '',
    });

    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Tesis eklenemedi' }, { status: 500 });
  }
}
