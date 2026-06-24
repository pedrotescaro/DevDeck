import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { removeJwtCookie } from '@/lib/jwt';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await removeJwtCookie();
  return NextResponse.json({ ok: true });
}
