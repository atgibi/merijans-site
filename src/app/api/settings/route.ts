import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.key] = row.value;
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Ayarlar yüklenemedi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const stmt = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP');
    const txn = db.transaction((settings: Record<string, string>) => {
      for (const [key, value] of Object.entries(settings)) {
        stmt.run(key, value);
      }
    });
    txn(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ayarlar güncellenemedi' }, { status: 500 });
  }
}
