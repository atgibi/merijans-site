import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const properties = db.prepare('SELECT * FROM odarota_properties ORDER BY created_at DESC').all();
    const media = db.prepare('SELECT * FROM odarota_media ORDER BY property_id, sort_order ASC').all();

    const data = {
      export_date: new Date().toISOString(),
      total_properties: (properties as unknown[]).length,
      total_media: (media as unknown[]).length,
      properties,
      media,
    };

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="odarota-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Dışa aktarma başarısız' }, { status: 500 });
  }
}
