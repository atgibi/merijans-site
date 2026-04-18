import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const services = db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Hizmetler yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const result = db.prepare(
      'INSERT INTO services (title, description, icon, sort_order, active) VALUES (?, ?, ?, ?, ?)'
    ).run(body.title, body.description, body.icon || 'globe', body.sort_order || 0, body.active ?? 1);
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Hizmet eklenemedi' }, { status: 500 });
  }
}
