import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const pages = db.prepare('SELECT * FROM pages ORDER BY id ASC').all();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: 'Sayfalar yüklenemedi' }, { status: 500 });
  }
}
