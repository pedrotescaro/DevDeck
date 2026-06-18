import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/feed';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth Code Exchange Error:', error);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data?.user) {
      const email = data.user.email;
      const username =
        data.user.user_metadata?.preferred_username ||
        data.user.user_metadata?.username ||
        `user_${data.user.id.substring(0, 8)}`;

      try {
        // Verificar se o usuário já existe no banco PostgreSQL via Prisma
        const existingUser = await prisma.user.findUnique({
          where: { id: data.user.id },
        });

        if (!existingUser) {
          // Criar usuário no banco
          const dbUser = await prisma.user.create({
            data: {
              id: data.user.id,
              username,
              email: email!,
              avatar_url:
                data.user.user_metadata?.avatar_url ||
                `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`,
              bio: 'Novo desenvolvedor no DevDeck via GitHub! 🚀',
              github_username: username,
              total_xp: 0,
            },
          });

          // Inicializar trilhas de linguagem padrões para o usuário do GitHub
          const defaultLanguages = [
            'TS',
            'JS',
            'PYTHON',
            'RUST',
            'GO',
            'CPP',
            'JAVA',
            'KOTLIN',
            'SWIFT',
          ];
          await prisma.languageTrail.createMany({
            data: defaultLanguages.map((lang) => ({
              user_id: dbUser.id,
              language: lang as any,
              xp: 0,
              level: 1,
              streak: 0,
            })),
          });
        }
      } catch (dbError) {
        console.error('Database sync error during OAuth signup:', dbError);
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent('Erro ao sincronizar dados com o banco de dados.')}`
        );
      }
    }
  }

  // Redirecionar para o destino
  return NextResponse.redirect(`${origin}${next}`);
}
