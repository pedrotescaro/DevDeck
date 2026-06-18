import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Language } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    if (language) {
      // Leaderboard filtrado por linguagem
      const leaders = await prisma.languageTrail.findMany({
        where: { language: language as Language },
        orderBy: { xp: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              username: true,
              avatar_url: true,
              total_xp: true,
            },
          },
        },
      });

      const formatted = leaders.map((leader, index) => ({
        rank: index + 1,
        username: leader.user.username,
        avatar_url: leader.user.avatar_url,
        xp: leader.xp,
        level: leader.level,
      }));

      return NextResponse.json(formatted);
    } else {
      // Leaderboard global baseado no total_xp do usuário
      const leaders = await prisma.user.findMany({
        orderBy: { total_xp: 'desc' },
        take: 10,
        select: {
          username: true,
          avatar_url: true,
          total_xp: true,
        },
      });

      const formatted = leaders.map((leader, index) => ({
        rank: index + 1,
        username: leader.username,
        avatar_url: leader.avatar_url,
        xp: leader.total_xp,
        level: Math.max(1, Math.floor(leader.total_xp / 1000) + 1), // Nível global dinâmico
      }));

      return NextResponse.json(formatted);
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Erro ao buscar ranking' }, { status: 500 });
  }
}
