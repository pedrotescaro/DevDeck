import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitResult = await rateLimit(`register:${ip}`, 5, "1 h");
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Muitas tentativas de cadastro a partir deste IP. Limite de 5 por hora excedido.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validar corpo da requisição
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { username, email, password } = result.data;

    // Verificar se o nome de usuário já está sendo usado no Prisma
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json({ error: "Nome de usuário já está em uso" }, { status: 400 });
    }

    // Verificar se o e-mail já está sendo usado no Prisma
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json({ error: "Endereço de e-mail já está em uso" }, { status: 400 });
    }

    // Criar cliente Supabase do lado do servidor
    const supabase = await createClient();

    // 1. Cadastrar na autenticação do Supabase
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
      return NextResponse.json({ error: "Erro ao criar conta de autenticação" }, { status: 500 });
    }

    // 2. Criar registro do usuário no banco PostgreSQL via Prisma
    const dbUser = await prisma.user.create({
      data: {
        id: authUser.id,
        username,
        email,
        avatar_url: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`,
        bio: "Novo desenvolvedor no DevDeck! 🚀",
        total_xp: 0,
      },
    });

    // 3. Inicializar as LanguageTrails padrões para o novo usuário com 0 XP
    const defaultLanguages = ["TS", "JS", "PYTHON", "RUST", "GO", "CPP", "JAVA", "KOTLIN", "SWIFT"];
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
  } catch (error: any) {
    console.error("Error in registration endpoint:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao cadastrar" },
      { status: 500 }
    );
  }
}
