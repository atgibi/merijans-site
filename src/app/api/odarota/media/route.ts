import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const propertyId = formData.get('property_id') as string;
    const files = formData.getAll('files') as File[];

    if (!propertyId) return NextResponse.json({ error: 'property_id gerekli' }, { status: 400 });
    if (!files || files.length === 0) return NextResponse.json({ error: 'Dosya seçilmedi' }, { status: 400 });

    const db = getDb();
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', propertyId);
    await mkdir(uploadDir, { recursive: true });

    const uploaded: { id: number; path: string; name: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const safeName = `${Date.now()}-${i}${ext}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);

      const isVideo = file.type.startsWith('video/');
      const dbPath = `/uploads/${propertyId}/${safeName}`;

      const result = db.prepare(
        'INSERT INTO odarota_media (property_id, file_path, file_type, file_name, file_size, sort_order, is_cover) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(propertyId, dbPath, isVideo ? 'video' : 'image', file.name, buffer.length, i, i === 0 ? 1 : 0);

      uploaded.push({ id: Number(result.lastInsertRowid), path: dbPath, name: file.name });
    }

    return NextResponse.json({ success: true, files: uploaded });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 });

    const db = getDb();
    const media = db.prepare('SELECT * FROM odarota_media WHERE id = ?').get(id) as { file_path: string } | undefined;
    if (media) {
      const fs = require('fs');
      const fullPath = path.join(process.cwd(), 'public', media.file_path);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    db.prepare('DELETE FROM odarota_media WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 });
  }
}
