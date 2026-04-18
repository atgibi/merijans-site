import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const properties = db.prepare('SELECT * FROM odarota_properties ORDER BY created_at DESC').all() as Record<string, unknown>[];

    if (properties.length === 0) {
      return new NextResponse('Veri bulunamadı', { status: 404 });
    }

    const headers = Object.keys(properties[0]);
    const csvRows = [
      headers.join(','),
      ...properties.map(row =>
        headers.map(h => {
          const val = String(row[h] ?? '');
          return val.includes(',') || val.includes('"') || val.includes('\n')
            ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(',')
      ),
    ];

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="odarota-tesisler-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'CSV dışa aktarma başarısız' }, { status: 500 });
  }
}
