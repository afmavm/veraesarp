import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({ success: true, data: db });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database GET failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedDb = saveDatabase(body);
    return NextResponse.json({ success: true, data: updatedDb });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database POST failed' }, { status: 500 });
  }
}
