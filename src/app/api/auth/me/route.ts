import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Giriş yapılmamış' }, { status: 401 });
  return NextResponse.json({ username: user.username, id: user.id });
}
