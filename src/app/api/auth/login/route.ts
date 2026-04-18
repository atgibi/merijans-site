import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const db = getDb();
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username) as { id: number; username: string; password: string } | undefined;
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre' }, { status: 401 });
    }
    const token = createToken({ username: admin.username, id: admin.id });
    const response = NextResponse.json({ success: true, username: admin.username });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Giriş başarısız' }, { status: 500 });
  }
}
