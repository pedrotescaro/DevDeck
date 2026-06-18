import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { registerSchema } from '@/lib/validators';
import { rateLimit } from '@/lib/ratelimit';
import { apiHandler } from '@/lib/api-handler';

export const POST = apiHandler(async (request) => {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // Execute Upstash rate limit
  await rateLimit(`register:${ip}`, {
    limit: 5,
    window: '1 h',
    endpoint: '/api/auth/register',
  });

  const body = await request.json();

  // Validate request body
  const parsed = registerSchema.parse(body);
  const { username, email, password } = parsed;

  // Check username unique
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    return NextResponse.json({ error: 'Nome de usuário já está em uso' }, { status: 400 });
  }

  // Check email unique
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    return NextResponse.json({ error: 'Endereço de e-mail já está em uso' }, { status: 400 });
  }

  // Create server-side Supabase client
  const supabase = await createClient();

  // 1. Sign up in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const authUser = authData.user;
  if (!authUser) {
    return NextResponse.json({ error: 'Erro ao criar conta de autenticação' }, { status: 500 });
  }

  // 2. Create database user record via Prisma
  const dbUser = await prisma.user.create({
    data: {
      id: authUser.id,
      username,
      email,
      avatar_url: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`,
      bio: 'Novo desenvolvedor no DevDeck! 🚀',
      total_xp: 0,
    },
  });

  // 3. Initialize default LanguageTrails for the new user
  const defaultLanguages = ['TS', 'JS', 'PYTHON', 'RUST', 'GO', 'CPP', 'JAVA', 'KOTLIN', 'SWIFT'];
  await prisma.languageTrail.createMany({
    data: defaultLanguages.map((lang) => ({
      user_id: dbUser.id,
      language: lang as any,
      xp: 0,
      level: 1,
      streak: 0,
    })),
  });

  return NextResponse.json({ success: true, user: dbUser });
});
