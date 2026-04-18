import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Mesajlar yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Ad, e-posta ve mesaj gereklidir' }, { status: 400 });
    }
    const db = getDb();
    db.prepare('INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)')
      .run(body.name, body.email, body.phone || '', body.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj gönderilemedi' }, { status: 500 });
  }
}
